const DataLoader = require('dataloader');
const Event = require("../../models/event");
const User = require("../../models/user");

const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({_id: {$in: userIds}});
});

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    })
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  creator: user.bind(this,event._doc.creator)
});

const transformBooking = booking => ({
  ...booking._doc,
  _id: booking.id,
  user: user.bind(this,booking._doc.user),
  event: singleEvent.bind(this,booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt)
});

const authenticate = (req) => {
  if (!req.isAuth) {
      throw new Error('Unauthorized!');
    }
}

module.exports = {
  user,
  singleEvent,
  events,
  transformEvent,
  transformBooking,
  authenticate
};