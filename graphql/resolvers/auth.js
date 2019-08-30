const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = require("../../models/user");

module.exports = {
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error ('User does not exists!');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error ('Password is incorrect!');
      }

      const token = jwt.sign({userId: user.id, email: user.email}, 'Montimage2019', {
        expiresIn: '1h'
      });

      return {
        userId: user.id,
        token,
        tokenExpiration: 1
      };

    } catch (error) {
      throw error;
    }
  }
};
