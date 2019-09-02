const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { transformBooking, transformEvent, authenticate } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    authenticate(req);
    try {
      const bookings = await Booking.find({user: req.userId});
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async ({ eventId }, req) => {
    authenticate(req);
    try {
      const fetchedEvent = await Event.findOne({ _id: eventId });
      if (!fetchedEvent) {
        throw new Error("Event not found!");
      }
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async ({bookingId}, req) => {
    authenticate(req);
    try {
      const booking = await Booking.findById(bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  }
};
