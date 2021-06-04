import jwt from "jsonwebtoken";

export async function logUserOut(request, reply) {
  try {
    const JWTSignature = process.env.JWT_SIGNATURE;

    const { session } = await import("../session/session.js");
    // Get refresh token
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // Decode sessionToken from refreshToken
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // Delete database record for session
      await session.deleteOne({ sessionToken });
    }
    // Remove cookies
    reply.clearCookie("refreshToken").clearCookie("accessToken");
  } catch (error) {
    console.error(error);
  }
}
