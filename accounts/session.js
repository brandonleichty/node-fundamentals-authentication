import { randomBytes } from "crypto";

export async function createSession(userId, connection) {
  try {
    // Generate a session token
    const sessionToken = randomBytes(43).toString("hex");
    // Retrieve connection information
    const { ip, userAgent } = connection;
    // Database insert for session
    const { session } = await import("../session/session.js");
    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createAt: new Date(),
    });
    // Return a session token
    return sessionToken;
  } catch (error) {
    console.error(error);
    throw new Error("Session creation failed");
  }
}
