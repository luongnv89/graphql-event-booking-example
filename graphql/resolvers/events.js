const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events.map(event => transformEvent(event));
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
      createdEvents = transformEvent(result);
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
  }
};