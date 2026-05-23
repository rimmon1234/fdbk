import { loadEnvConfig } from "@next/env";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

loadEnvConfig(process.cwd());

const testerNamesByEmail: Record<string, string> = {
  "shourjya.biswas.cse28@heritageit.edu.in": "Tester 00",
  "rimmon.bhowmick.cse28@heritageit.edu.in": "Tester 01",
  "rupkatha.ghosh.cse28@heritageit.edu.in": "Tester 02",
  "soham.banerjee.cse28@heritageit.edu.in": "Tester 03",
  "sayan.sinha.cse28@heritageit.edu.in": "Tester 04",
  "ankan.giri.cse28@heritageit.edu.in": "Tester 05",
  "aritro.bag.cse28@heritageit.edu.in": "Tester 06",
  "ayush.singh.cse28@heritageit.edu.in": "Tester 07",
  "anshuman.katyanjha.cse28@heritageit.edu.in": "Tester 08",
  "kaustav.nag.cse28@heritageit.edu.in": "Tester 09",
  "md.arbajahmad.cse28@heritageit.edu.in": "Tester 10",
  "swarnavo.sen.cse28@heritageit.edu.in": "Tester 11",
  "prachi.kumari.cse28@heritageit.edu.in": "Tester 12",
  "asmita.biswas.cse28@heritageit.edu.in": "Tester 13",
  "dhiraj.kumarchowdhury.cse28@heritageit.edu.in": "Tester 14",
  "suman.bhadra.cse28@heritageit.edu.in": "Tester 15",
  "soubhagyya.bhattacharya.cse28@heritageit.edu.in": "Tester 16",
  "ayush.kumar.cse28@heritageit.edu.in": "Tester 17",
  "aditya.kumar.cse28@heritageit.edu.in": "Tester 18",
  "anshu.raja.cse28@heritageit.edu.in": "Tester 19",
  "deep.pati.cse28@heritageit.edu.in": "Tester 20",
  "ankit.raj.cse28@heritageit.edu.in": "Tester 21",
  "shaumik.sarkar.cse28@heritageit.edu.in": "Tester 22",
  "soumyajit.ghosh.cse28@heritageit.edu.in": "Tester 23",
  "shrirup.bhattacharyya.cse28@heritageit.edu.in": "Tester 24",
  "siddharth.singh.cse28@heritageit.edu.in": "Tester 25",
  "trishani.mondal.cse28@heritageit.edu.in": "Tester 26",
  "srijani.palchaudhuri.cse28@heritageit.edu.in": "Tester 27",
  "ananya.chatterjee.cse28@heritageit.edu.in": "Tester 28",
  "oindrayee.chaudhury.cse28@heritageit.edu.in": "Tester 29",
  "joydep.mondal.cse28@heritageit.edu.in": "Tester 30",
  "kuntal.das.cse28@heritageit.edu.in": "Tester 31",
  "shovan.dhara.cse28@heritageit.edu.in": "Tester 32",
  "susnata.gantait.cse28@heritageit.edu.in": "Tester 33",
  "nilanjana.dey.cse28@heritageit.edu.in": "Tester 34",
  "souvik.nandi.cse28@heritageit.edu.in": "Tester 35",
  "swarnik.patra.cse28@heritageit.edu.in": "Tester 36",
  "sujoy.mondal.cse28@heritageit.edu.in": "Tester 37",
  "anuj.kumarsingh.cse28@heritageit.edu.in": "Tester 38"
};

const testerGroups = [
  {
    id: "group-1",
    name: "Group 1",
    members: [
      "shourjya.biswas.cse28@heritageit.edu.in",
      "rimmon.bhowmick.cse28@heritageit.edu.in",
      "aritro.bag.cse28@heritageit.edu.in",
      "asmita.biswas.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-3",
    name: "Group 3",
    members: [
      "rupkatha.ghosh.cse28@heritageit.edu.in",
      "ankan.giri.cse28@heritageit.edu.in",
      "prachi.kumari.cse28@heritageit.edu.in",
      "sayan.sinha.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-2",
    name: "Group 2",
    members: [
      "soham.banerjee.cse28@heritageit.edu.in",
      "swarnavo.sen.cse28@heritageit.edu.in",
      "suman.bhadra.cse28@heritageit.edu.in",
      "soubhagyya.bhattacharya.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-6",
    name: "Group 6",
    members: [
      "ayush.singh.cse28@heritageit.edu.in",
      "dhiraj.kumarchowdhury.cse28@heritageit.edu.in",
      "nilanjana.dey.cse28@heritageit.edu.in",
      "shovan.dhara.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-5",
    name: "Group 5",
    members: [
      "anshuman.katyanjha.cse28@heritageit.edu.in",
      "susnata.gantait.cse28@heritageit.edu.in",
      "anuj.kumarsingh.cse28@heritageit.edu.in",
      "souvik.nandi.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-7",
    name: "Group 7",
    members: [
      "kaustav.nag.cse28@heritageit.edu.in",
      "md.arbajahmad.cse28@heritageit.edu.in",
      "soumyajit.ghosh.cse28@heritageit.edu.in",
      "shrirup.bhattacharyya.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-8",
    name: "Group 8",
    members: [
      "ayush.kumar.cse28@heritageit.edu.in",
      "aditya.kumar.cse28@heritageit.edu.in",
      "anshu.raja.cse28@heritageit.edu.in",
      "swarnik.patra.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-9",
    name: "Group 9",
    members: [
      "ankit.raj.cse28@heritageit.edu.in",
      "deep.pati.cse28@heritageit.edu.in",
      "siddharth.singh.cse28@heritageit.edu.in",
      "sujoy.mondal.cse28@heritageit.edu.in"
    ],
  },
  {
    id: "group-10",
    name: "Group 10",
    members: [
      "kuntal.das.cse28@heritageit.edu.in",
      "joydep.mondal.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-4",
    name: "Group 4",
    members: [
      "trishani.mondal.cse28@heritageit.edu.in",
      "srijani.palchaudhuri.cse28@heritageit.edu.in",
      "ananya.chatterjee.cse28@heritageit.edu.in",
      "oindrayee.chaudhury.cse28@heritageit.edu.in",
    ],
  },
  {
    id: "group-test",
    name: "Group test",
    members: ["aritrobag362@gmail.com"],
  },
] as const;

function formatNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(".")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDuplicateMemberships() {
  const membershipsByEmail = new Map<string, string[]>();

  for (const group of testerGroups) {
    for (const email of group.members) {
      const normalizedEmail = email.toLowerCase().trim();
      membershipsByEmail.set(normalizedEmail, [...(membershipsByEmail.get(normalizedEmail) ?? []), group.name]);
    }
  }

  return Array.from(membershipsByEmail.entries()).filter(([, groups]) => groups.length > 1);
}

async function seed() {
  const duplicateMemberships = getDuplicateMemberships();
  if (duplicateMemberships.length > 0) {
    throw new Error(
      `Each tester must belong to exactly one group. Duplicate memberships found: ${duplicateMemberships
        .map(([email, groups]) => `${email} in ${groups.join(", ")}`)
        .join("; ")}`
    );
  }

  const testers = testerGroups.flatMap((group) =>
    group.members.map((email) => {
      const normalizedEmail = email.toLowerCase().trim();
      return {
        email: normalizedEmail,
        name: testerNamesByEmail[normalizedEmail] ?? formatNameFromEmail(normalizedEmail),
        group: group.name,
      };
    })
  );

  await connectToDatabase();

  await Promise.all(
    testers.map((tester) =>
      User.updateOne(
        { email: tester.email },
        {
          $set: {
            name: tester.name,
            group: tester.group,
            isAuthorized: true,
            hasSubmitted: false,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      )
    )
  );

  console.log(`Upserted ${testers.length} tester users across ${testerGroups.length} groups`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
