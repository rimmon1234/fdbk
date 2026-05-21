import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

loadEnvConfig(process.cwd());

async function clearTesters() {
  await connectToDatabase();

  // Safely delete ONLY users with the role "tester", ignoring the admin!
  const result = await User.deleteMany({ role: "tester" });

  console.log(`Successfully deleted ${result.deletedCount} testers.`);
  process.exit(0);
}

clearTesters().catch((error) => {
  console.error("Failed to clear testers:", error);
  process.exit(1);
});
