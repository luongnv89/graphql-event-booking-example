const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
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
