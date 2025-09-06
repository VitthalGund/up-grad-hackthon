import { PrismaClient, NodeType, SubscriptionTier } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/en_IN"; // Using India locale for names
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const NUMBER_OF_USERS = 50;
const NUMBER_OF_COURSES = 4;

// Expanded course curriculum
const courseTemplates = [
  {
    title: "Full Stack Web Development",
    concepts: [
      "html_101",
      "css_101",
      "js_101",
      "react_201",
      "node_101",
      "db_101",
    ],
  },
  {
    title: "Data Science with Python",
    concepts: [
      "python_basics",
      "pandas_intro",
      "numpy_fundamentals",
      "matplotlib_viz",
      "scikit_learn_intro",
    ],
  },
  {
    title: "Advanced React Patterns",
    concepts: [
      "react_201",
      "react_performance",
      "react_testing",
      "react_state_management",
    ],
  },
  {
    title: "DevOps Fundamentals",
    concepts: [
      "docker_intro",
      "kubernetes_basics",
      "ci_cd_pipelines",
      "monitoring_logging",
    ],
  },
];

async function main() {
  console.log(
    "🌱 Starting to seed the database with a large, realistic dataset..."
  );

  // 1. Clean up existing data
  console.log("🧹 Clearing old data...");
  await prisma.userInteraction.deleteMany();
  await prisma.learnerReport.deleteMany();
  await prisma.learnerProfile.deleteMany();
  await prisma.contentNode.deleteMany();
  await prisma.user.deleteMany();

  // 2. Generate Content Nodes using varied Faker data
  console.log(`📚 Creating content for ${NUMBER_OF_COURSES} courses...`);
  const allContentNodesData = [];
  for (let i = 0; i < NUMBER_OF_COURSES; i++) {
    const course = courseTemplates[i];
    console.log(`  -> Generating content for "${course.title}"`);
    for (const conceptId of course.concepts) {
      // For each concept, create 2 videos, 2 articles, and 1 quiz
      for (let j = 0; j < 5; j++) {
        const nodeType =
          j < 2 ? NodeType.VIDEO : j < 4 ? NodeType.ARTICLE : NodeType.QUIZ;
        const node = {
          title: `${faker.hacker.verb()} the ${faker.hacker.noun()} in ${conceptId.replace(
            /_/g,
            " "
          )}`,
          nodeType: nodeType,
          contentJson: {
            conceptId: conceptId,
            course: course.title,
            // Add realistic details based on type using Faker
            ...(nodeType === "VIDEO" && {
              durationMinutes: faker.number.int({ min: 5, max: 15 }),
            }),
            ...(nodeType === "ARTICLE" && {
              wordCount: faker.number.int({ min: 300, max: 1200 }),
            }),
            ...(nodeType === "QUIZ" && {
              question: `What is the primary function of ${faker.hacker.abbreviation()} in ${conceptId}?`,
              hint: faker.hacker.phrase(),
            }),
          },
          createdAt: faker.date.past({ years: 1 }),
        };
        allContentNodesData.push(node);
      }
    }
  }
  // Use createMany for performance
  await prisma.contentNode.createMany({
    data: allContentNodesData,
  });
  const createdNodes = await prisma.contentNode.findMany();
  console.log(`✓ Created ${createdNodes.length} content nodes.`);

  // 3. Generate Users with diverse profiles
  console.log(`👤 Creating ${NUMBER_OF_USERS} users...`);
  const usersData = [];
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const name = faker.person.fullName();
    const isPremium = i < 10; // First 10 users are premium
    const user = {
      name: name,
      email: faker.internet.email({ firstName: name.split(" ")[0] }),
      age: faker.number.int({ min: 18, max: 60 }),
      hashedPassword: await bcrypt.hash("password123", 10),
      subscriptionTier: isPremium
        ? SubscriptionTier.PREMIUM
        : SubscriptionTier.FREE,
      hintCredits: isPremium ? 100 : 5,
      createdAt: faker.date.past({ years: 1 }),
    };
    usersData.push(user);
  }
  await prisma.user.createMany({
    data: usersData,
  });
  const createdUsers = await prisma.user.findMany();
  console.log(`✓ Created ${createdUsers.length} users.`);

  // 4. Generate Learner Profiles and simulate realistic Interactions
  console.log("📈 Simulating user activity and generating profiles...");
  for (const user of createdUsers) {
    const allConcepts = [
      ...new Set(createdNodes.map((n) => (n.contentJson as any).conceptId)),
    ];
    const competenceMap = allConcepts.reduce((acc, conceptId) => {
      acc[conceptId] = 0.1; // Start everyone at a baseline
      return acc;
    }, {} as Record<string, number>);

    // Simulate interactions to build up competence
    const interactionCount = faker.number.int({ min: 20, max: 150 });
    const userInteractionsData = [];
    for (let i = 0; i < interactionCount; i++) {
      const randomNode = faker.helpers.arrayElement(
        createdNodes.filter((n) => n.nodeType === "QUIZ")
      );
      const conceptId = (randomNode.contentJson as any).conceptId;
      const isCorrect = faker.datatype.boolean(0.7);

      userInteractionsData.push({
        userId: user.id,
        contentNodeId: randomNode.id,
        interactionType: "QUIZ_ATTEMPT",
        data: { isCorrect, conceptId },
        createdAt: faker.date.between({ from: user.createdAt, to: new Date() }),
      });

      // Simple BKT-like update for competence map
      const currentProb = competenceMap[conceptId];
      const learningRate = 0.15; // How much they learn from one correct answer
      if (isCorrect) {
        competenceMap[conceptId] =
          currentProb + (1 - currentProb) * learningRate;
      } else {
        competenceMap[conceptId] =
          currentProb - currentProb * (learningRate / 2);
      }
      competenceMap[conceptId] = Math.max(
        0.01,
        Math.min(0.99, competenceMap[conceptId])
      );
    }

    await prisma.userInteraction.createMany({
      data: userInteractionsData,
    });

    // Create the final learner profile with the simulated competence
    await prisma.learnerProfile.create({
      data: {
        userId: user.id,
        engagementScore: faker.number.float({
          min: 0.5,
          max: 0.98,
          precision: 0.01,
        }),
        competenceMap: competenceMap,
      },
    });
  }
  console.log("✓ Generated learner profiles and simulated interactions.");

  console.log("✅ Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
