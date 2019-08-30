const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent, authenticate } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events.map(event => transformEvent(event));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async ({eventInput}, req) => { // req is the second argument which is added automatically
    authenticate(req);
    try {
      const event = new Event({
        title: eventInput.title,
        description: eventInput.description,
        price: +eventInput.price,
        date: new Date(eventInput.date),
        creator: req.userId
      });
      let createdEvents;
      const result = await event.save();
      createdEvents = transformEvent(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        console.log(creator);
        throw new Error("User does not exists");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvents;
    } catch (error) {
      throw error;
    }
  }
};