import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error("Missing ADMIN_EMAIL");
  }

  await connectToDatabase();

  await User.updateOne(
    { email: adminEmail },
    {
      $set: {
        name: "Admin",
        isAuthorized: true,
        hasSubmitted: false,
        createdAt: new Date(),
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
