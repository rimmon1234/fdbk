import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

loadEnvConfig(process.cwd());

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    throw new Error("Missing ADMIN_EMAIL");
  }

  if (!adminPassword) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  await connectToDatabase();

  const hashedPassword = await bcryptjs.hash(adminPassword, 10);

  await User.updateOne(
    { email: adminEmail },
    {
      $set: {
        name: "Admin",
        isAuthorized: true,
        hasSubmitted: false,
        createdAt: new Date(),
        password: hashedPassword,
        role: "admin",
      },
    },
    { upsert: true }
  );

  console.log(`Admin upserted: ${adminEmail}`);
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
