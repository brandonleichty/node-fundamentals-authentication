import bcrypt from "bcryptjs";

const { compare } = bcrypt;

export async function authorizeUser(email, password) {
  // Import User collectoin
  const { user } = await import("../user/user.js");

  // Look up user
  const userData = await user.findOne({ "email.address": email });
  console.log("userData", userData);
  // Get user password
  const savedPassword = userData.password;

  // Compare password with one in database
  const isAuthorized = await compare(password, savedPassword);
  // Return a boolean if password is correct: true / false

  return { isAuthorized, userId: userData._id };
}
