import jwt from "jsonwebtoken";

const generateToken = (user) => {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    return token;
  } catch (error) {
    console.log(`Error while generating token: ${error.message}`)
  }
};

export default generateToken;