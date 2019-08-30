const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      if (!fetchedEvent) {
        throw new Error("Event not found!");
      }
      const booking = new Booking({
        user: "5d67d7675b481280c82a1a81",
        event: fetchedEvent
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  }
};
