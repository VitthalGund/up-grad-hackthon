import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { PrismaClient } from "@prisma/client";

// --- Configuration ---
const NEXTJS_BASE_URL = "http://localhost:3000/api";
const prisma = new PrismaClient(); // Add prisma client for fetching real data

const TEST_USER = {
  name: "Api Test User",
  email: `test-${Date.now()}@example.com`,
  password: "password123",
  age: 25,
};

// Create an axios instance that automatically handles cookies
const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true })); // Ensure credentials (cookies) are sent

function logResult(testName: string, success: boolean, data?: any) {
  if (success) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`\n❌ FAIL: ${testName}`);
    if (data) console.error("   └── Response:", data);
    process.exit(1);
  }
}

async function runApiTests() {
  console.log("🚀 Starting API integration tests...");
  console.log("------------------------------------");

  try {
    // 1. User Registration
    const registerRes = await client.post(
      `${NEXTJS_BASE_URL}/auth/register`,
      TEST_USER
    );
    logResult("User Registration", registerRes.status === 201);

    // 2. Get CSRF Token
    const csrfRes = await client.get(`${NEXTJS_BASE_URL}/auth/csrf`);
    const csrfToken = csrfRes.data.csrfToken;
    logResult("Get CSRF Token", !!csrfToken);

    // 3. User Login
    const loginRes = await client.post(
      `${NEXTJS_BASE_URL}/auth/signin/credentials`,
      new URLSearchParams({
        email: TEST_USER.email,
        password: TEST_USER.password,
        csrfToken: csrfToken,
        json: "true",
      })
    );
    logResult("User Login", loginRes.status === 200 && loginRes.data.url);

    // --- START OF FIX ---
    // 4. NEW STEP: Explicitly verify the session is active
    const sessionRes = await client.get(`${NEXTJS_BASE_URL}/auth/session`);
    logResult(
      "Verify Session",
      sessionRes.status === 200 &&
        sessionRes.data.user.email === TEST_USER.email
    );
    // --- END OF FIX ---

    // 5. Fetch Dashboard Data (now that session is confirmed)
    const dashboardRes = await client.get(`${NEXTJS_BASE_URL}/user/dashboard`);
    logResult(
      "Fetch Dashboard Data",
      dashboardRes.status === 200 &&
        dashboardRes.data.user.name === TEST_USER.name
    );

    // 6. Fetch a REAL Content Node from the database
    const firstNode = await prisma.contentNode.findFirst({
      where: { nodeType: "QUIZ" },
    });
    if (!firstNode) {
      throw new Error(
        "Database not seeded with QUIZ content. Run 'npm run db:seed' first."
      );
    }
    const contentNodeId = firstNode.id;
    logResult("Find Seeded Content Node", !!contentNodeId);

    const contentRes = await client.get(
      `${NEXTJS_BASE_URL}/content/${contentNodeId}`
    );
    logResult("Fetch Content Node", contentRes.status === 200);

    // 7. Log User Interaction
    const interactionRes = await client.post(
      `${NEXTJS_BASE_URL}/interactions`,
      {
        contentNodeId: contentNodeId,
        interactionType: "QUIZ_ATTEMPT",
        data: { isCorrect: true, conceptId: "html_101" },
      }
    );
    logResult("Log User Interaction", interactionRes.status === 202);

    // 8. Use a Hint
    const hintRes = await client.post(`${NEXTJS_BASE_URL}/hints/use`, {
      contentNodeId,
    });
    logResult("Use a Hint", hintRes.status === 200 && hintRes.data.hint);

    // ... The rest of the tests remain the same
    console.log("------------------------------------");
    console.log("🎉 All API tests passed successfully!");
  } catch (error: any) {
    const testName = error.config?.url || "Unknown Test";
    console.error(`\n❌ FAIL on: ${testName}`);
    if (error.response) {
      console.error("   └── Response:", error.response.data);
    } else {
      console.error("   └── Error:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runApiTests();
