import { SignJWT, jwtVerify } from "jose";

// Ensure JWT_SECRET is present
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("CRITICAL: JWT_SECRET environment variable is missing");
}

const SECRET_KEY = new TextEncoder().encode(secret);

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
}

export async function signJWT(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}
