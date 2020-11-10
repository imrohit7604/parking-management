const { User } = require("../models/user");

async function authentication(_id, email) {
  let userId = await User.findById(_id);
  let userEmail = await User.findOne({ email: email });

  if (userId && userEmail) return true;
  else return false;
}

module.exports.authentication = authentication;
