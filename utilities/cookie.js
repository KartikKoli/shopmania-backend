import convertDurationToMs from "./convertTime.js";

const sendTokeninCookie = (res, token) => {
  try {
    const cookieExpiry = convertDurationToMs(process.env.JWT_EXPIRY);
    res.cookie(process.env.ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: cookieExpiry, 
    });
  } catch (error) {
    console.log(`Error while sending token in cookie: ${error.message}`);
  }
};

export default sendTokeninCookie;
