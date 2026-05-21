import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      userId: string;
      name: string;
      email: string;
    };
  }

  interface User {
    userId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    name?: string | null;
    email?: string | null;
  }
}
