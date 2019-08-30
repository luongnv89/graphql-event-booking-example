const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
  createUser: async ({userInput}) => {
    try {
      let user = await User.findOne({ email: userInput.email });
      if (user) {
        console.log(user);
        throw new Error("User exists already");
      }
      const password = await bcrypt.hash(userInput.password, 12);
      user = new User({
        email: userInput.email,
        password: password
      });

      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  }
};
