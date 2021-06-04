import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    // Create refresh token
    // Session Id
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSignature
    );
    // Create assess token
    // Session Id, ser Id
    const accessToken = jwt.sign(
      {
        userId,
        sessionToken,
      },
      JWTSignature
    );
    // Return refresh token & access token
    return { refreshToken, accessToken };
  } catch (error) {
    console.error("Error: ", error);
  }
}
