import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const testers = [
  ["tester01@example.com", "Tester 01"],
  ["tester02@example.com", "Tester 02"],
  ["tester03@example.com", "Tester 03"],
  ["tester04@example.com", "Tester 04"],
  ["tester05@example.com", "Tester 05"],
  ["tester06@example.com", "Tester 06"],
  ["tester07@example.com", "Tester 07"],
  ["tester08@example.com", "Tester 08"],
  ["tester09@example.com", "Tester 09"],
  ["tester10@example.com", "Tester 10"],
  ["tester11@example.com", "Tester 11"],
  ["tester12@example.com", "Tester 12"],
  ["tester13@example.com", "Tester 13"],
  ["tester14@example.com", "Tester 14"],
  ["tester15@example.com", "Tester 15"],
  ["tester16@example.com", "Tester 16"],
  ["tester17@example.com", "Tester 17"],
  ["tester18@example.com", "Tester 18"],
  ["tester19@example.com", "Tester 19"],
  ["tester20@example.com", "Tester 20"],
  ["tester21@example.com", "Tester 21"],
  ["tester22@example.com", "Tester 22"],
  ["tester23@example.com", "Tester 23"],
  ["tester24@example.com", "Tester 24"],
  ["tester25@example.com", "Tester 25"],
  ["tester26@example.com", "Tester 26"],
  ["tester27@example.com", "Tester 27"],
  ["tester28@example.com", "Tester 28"],
  ["tester29@example.com", "Tester 29"],
  ["tester30@example.com", "Tester 30"],
  ["tester31@example.com", "Tester 31"],
  ["tester32@example.com", "Tester 32"],
  ["tester33@example.com", "Tester 33"],
  ["tester34@example.com", "Tester 34"],
] as const;

async function seed() {
  await connectToDatabase();

  await Promise.all(
    testers.map(([email, name]) =>
      User.updateOne(
        { email },
        {
          $set: {
            name,
            isAuthorized: true,
            hasSubmitted: false,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      )
    )
  );

  console.log(`Upserted ${testers.length} tester users`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
