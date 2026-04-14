/**
 * Seed script — populates the database with initial data
 * Run with: npx tsx prisma/seed.ts
 */

// import prisma from "../lib/db";
// import { generateMockExploits, generateMockThreats, generateMockCVEs, generateMockNews, generateMockCTFChallenges } from "../lib/mock-data";
// import { DEFAULT_CHAT_ROOMS, generateUsername } from "../lib/constants";
// import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding Xcloak database...\n");

  // 1. Create chat rooms
  // console.log("Creating chat rooms...");
  // for (const room of DEFAULT_CHAT_ROOMS) {
  //   await prisma.chatRoom.upsert({
  //     where: { slug: room.slug },
  //     update: {},
  //     create: { name: room.name, slug: room.slug, description: room.description, category: room.category },
  //   });
  // }
  // console.log(`  ✓ ${DEFAULT_CHAT_ROOMS.length} chat rooms created\n`);

  // 2. Create admin session
  // console.log("Creating admin session...");
  // const admin = await prisma.session.create({
  //   data: {
  //     username: "XcloakAdmin",
  //     role: "ADMIN",
  //     reputation: 10000,
  //     expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  //   },
  // });
  // console.log(`  ✓ Admin session created: ${admin.id}`);
  // console.log(`  ✓ Set ADMIN_SESSION_ID=${admin.id} in .env\n`);

  // 3. Create sample anonymous sessions
  // console.log("Creating sample sessions...");
  // const sessions = [];
  // for (let i = 0; i < 20; i++) {
  //   const session = await prisma.session.create({
  //     data: {
  //       username: generateUsername(),
  //       reputation: Math.floor(Math.random() * 5000),
  //       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //     },
  //   });
  //   sessions.push(session);
  // }
  // console.log(`  ✓ ${sessions.length} anonymous sessions created\n`);

  // 4. Seed exploits
  // console.log("Seeding exploits...");
  // const exploits = generateMockExploits(25);
  // for (const exploit of exploits) {
  //   const session = sessions[Math.floor(Math.random() * sessions.length)];
  //   await prisma.exploit.create({
  //     data: {
  //       title: exploit.title,
  //       description: exploit.description,
  //       code: exploit.code,
  //       category: exploit.category,
  //       os: exploit.os,
  //       severity: exploit.severity.toUpperCase() as any,
  //       language: exploit.language,
  //       payloadType: exploit.payloadType,
  //       tags: exploit.tags,
  //       cveId: null,
  //       authorId: session.id,
  //       upvotes: exploit.upvotes,
  //       downvotes: exploit.downvotes,
  //       commentCount: exploit.commentCount,
  //       downloadCount: exploit.downloadCount,
  //       viewCount: exploit.viewCount,
  //       verified: exploit.verified,
  //       trending: exploit.trending,
  //       status: "APPROVED",
  //     },
  //   });
  // }
  // console.log(`  ✓ ${exploits.length} exploits seeded\n`);

  // 5. Seed CVEs
  // console.log("Seeding CVEs...");
  // const cves = generateMockCVEs(15);
  // for (const cve of cves) {
  //   await prisma.cVEEntry.create({
  //     data: {
  //       id: cve.id,
  //       title: cve.title,
  //       description: cve.description,
  //       severity: cve.severity.toUpperCase() as any,
  //       cvssScore: cve.cvssScore,
  //       vendor: cve.vendor,
  //       product: cve.product,
  //       affectedVersions: cve.affectedVersions,
  //       references: cve.references,
  //       submittedById: admin.id,
  //       status: "APPROVED",
  //       cveStatus: cve.cveStatus.toUpperCase().replace(/ /g, "_") as any,
  //       mitigations: cve.mitigations,
  //       snortRule: cve.detectionRules.snort,
  //       yaraRule: cve.detectionRules.yara,
  //       sigmaRule: cve.detectionRules.sigma,
  //     },
  //   });
  // }
  // console.log(`  ✓ ${cves.length} CVEs seeded\n`);

  // 6. Seed threat events
  // console.log("Seeding threat events...");
  // const threats = generateMockThreats();
  // for (const t of threats) {
  //   await prisma.threatEvent.create({ data: t });
  // }
  // console.log(`  ✓ ${threats.length} threat events seeded\n`);

  // 7. Seed CTF challenges
  // console.log("Seeding CTF challenges...");
  // const ctfs = generateMockCTFChallenges();
  // for (const ctf of ctfs) {
  //   const flagHash = await bcrypt.hash(ctf.flag, 12);
  //   await prisma.cTFChallenge.create({
  //     data: {
  //       title: ctf.title,
  //       description: ctf.description,
  //       category: ctf.category,
  //       difficulty: ctf.difficulty,
  //       points: ctf.points,
  //       flagHash,
  //       hints: ctf.hints,
  //       authorId: admin.id,
  //       solveCount: ctf.solveCount,
  //       status: "APPROVED",
  //     },
  //   });
  // }
  // console.log(`  ✓ ${ctfs.length} CTF challenges seeded\n`);

  // 8. Seed news
  // console.log("Seeding news articles...");
  // const articles = generateMockNews(15);
  // for (const article of articles) {
  //   await prisma.newsArticle.create({ data: article });
  // }
  // console.log(`  ✓ ${articles.length} news articles seeded\n`);

  console.log("═══════════════════════════════════════");
  console.log("  🔒 Xcloak database seeded!");
  console.log("  Uncomment code above after running:");
  console.log("    1. Set DATABASE_URL in .env");
  console.log("    2. npx prisma db push");
  console.log("    3. npx tsx prisma/seed.ts");
  console.log("═══════════════════════════════════════");
}

main()
  .catch(console.error)
  .finally(() => {
    // prisma.$disconnect();
    process.exit(0);
  });
