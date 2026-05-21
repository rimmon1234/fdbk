import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
loadEnvConfig(process.cwd());

const testers = [
  ["shourjya.biswas.cse28@heritageit.edu.in", "Tester 00"],
  ["rimmon.bhowmick.cse28@heritageit.edu.in", "Tester 01"],
  ["rupkatha.ghosh.cse28@heritageit.edu.in", "Tester 02"],
  ["soham.banerjee.cse28@heritageit.edu.in", "Tester 03"],
  ["sayan.sinha.cse28@heritageit.edu.in", "Tester 04"],
  ["ankan.giri.cse28@heritageit.edu.in", "Tester 05"],
  ["aritro.bag.cse28@heritageit.edu.in", "Tester 06"],
  ["ayush.singh.cse28@heritageit.edu.in", "Tester 07"],
  ["anshuman.katyanjha.cse28@heritageit.edu.in", "Tester 08"],
  ["kaustav.nag.cse28@heritageit.edu.in", "Tester 09"],
  ["md.arbajahmad.cse28@heritageit.edu.in", "Tester 10"],
  ["swarnavo.sen.cse28@heritageit.edu.in", "Tester 11"],
  ["prachi.kumari.cse28@heritageit.edu.in", "Tester 12"],
  ["asmita.biswas.cse28@heritageit.edu.in", "Tester 13"],
  ["dhiraj.kumarchowdhury.cse28@heritageit.edu.in", "Tester 14"],
  ["suman.bhadra.cse28@heritageit.edu.in", "Tester 15"],
  ["soubhagyya.bhattacharya.cse28@heritageit.edu.in", "Tester 16"],
  ["ayush.kumar.cse28@heritageit.edu.in", "Tester 17"],
  ["aditya.kumar.cse28@heritageit.edu.in", "Tester 18"],
  ["anshu.raja.cse28@heritageit.edu.in", "Tester 19"],
  ["deep.pati.cse28@heritageit.edu.in", "Tester 20"],
  ["ankit.raj.cse28@heritageit.edu.in", "Tester 21"],
  ["shaumik.sarkar.cse28@heritageit.edu.in", "Tester 22"],
  ["soumyajit.ghosh.cse28@heritageit.edu.in", "Tester 23"],
  ["shrirup.bhattacharyya.cse28@heritageit.edu.in", "Tester 24"],
  ["siddharth.singh.cse28@heritageit.edu.in", "Tester 25"],
  ["trishani.mondal.cse28@heritageit.edu.in", "Tester 26"],
  ["srijani.palchaudhuri.cse28@heritageit.edu.in", "Tester 27"],
  ["ananya.chatterjee.cse28@heritageit.edu.in", "Tester 28"],
  ["oindrayee.chaudhury.cse28@heritageit.edu.in", "Tester 29"],
  ["joydep.mondal.cse28@heritageit.edu.in", "Tester 30"],
  ["kuntal.das.cse28@heritageit.edu.in", "Tester 31"],
  ["shovan.dhara.cse28@heritageit.edu.in", "Tester 32"],
  ["susnata.gantait.cse28@heritageit.edu.in", "Tester 33"],
  ["nilanjana.dey.cse28@heritageit.edu.in", "Tester 34"],
  ["souvik.nandi.cse28@heritageit.edu.in", "Tester 35"],
  ["sujoy.mondal.cse28@heritageit.edu.in", "Tester 36"],
  ["swarnik.patra.cse28@heritageit.edu.in", "Tester 37"],
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
