const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events.map(event => {
        // return {...event._doc, _id: event._doc._id.toString()};
        return {
          ...event._doc,
          _id: event.id,
          date: (new Date(event._doc.date)).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async args => {
    try {
      const data = args.eventInput;
      const event = new Event({
        title: data.title,
        description: data.description,
        price: +data.price,
        date: new Date(data.date),
        creator: "5d67d7675b481280c82a1a81"
      });
      let createdEvents;
      const result = await event.save();
      createdEvents = {
        ...result._doc,
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById("5d67d7675b481280c82a1a81");
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
  },

  createUser: async args => {
    try {
      const data = args.userInput;
      let user = await User.findOne({ email: data.email });
      if (user) {
        console.log(user);
        throw new Error("User exists already");
      }
      const password = await bcrypt.hash(data.password, 12);
      user = new User({
        email: data.email,
        password: password
      });

      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  }
};
