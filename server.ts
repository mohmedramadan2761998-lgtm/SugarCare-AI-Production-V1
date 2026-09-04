import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/*
 * Port 3000 is required by the container reverse proxy.
 */
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.json({ limit: "10mb" }));

// ----------------------------------------------------
// Google Gemini AI Client
// ----------------------------------------------------

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "sugarcare-ai",
        },
      },
    });
  }

  return aiClient;
}

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    appName: "SugarCare AI – Smart Diabetes Companion",
    environment: process.env.NODE_ENV || "development",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ----------------------------------------------------
// SugarCare AI Chat Assistant
// ----------------------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      userContext = {},
      language = "en",
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const {
      profile = {},
      recentReadings = [],
      stats = {},
      medications = [],
      meals = [],
      activities = [],
      weightRecords = [],
    } = userContext;

    const ai = getAIClient();

    /*
     * Fallback mode:
     * The rest of the application still works if Gemini API
     * is not configured.
     */
    if (!ai) {
      const average =
        stats.averageGlucose !== undefined
          ? stats.averageGlucose
          : "غير متاح";

      const highest =
        stats.highestGlucose !== undefined
          ? stats.highestGlucose
          : "غير متاح";

      const lowest =
        stats.lowestGlucose !== undefined
          ? stats.lowestGlucose
          : "غير متاح";

      const todayCount =
        stats.todayCount !== undefined ? stats.todayCount : 0;

      const reply =
        language === "ar"
          ? `مرحباً ${profile.name || ""} 👋

أنا مساعد SugarCare AI.

📊 ملخص البيانات المسجلة:
- متوسط السكر: ${average} ملغ/ديسيلتر
- أعلى قراءة: ${highest} ملغ/ديسيلتر
- أقل قراءة: ${lowest} ملغ/ديسيلتر
- عدد قراءات اليوم: ${todayCount}
- عدد الأدوية المسجلة: ${medications.length}

يمكنني مساعدتك في فهم اتجاهات البيانات التي سجلتها داخل التطبيق.

⚠️ هذه المعلومات للتتبع والتثقيف فقط، ولا تمثل تشخيصاً طبياً أو توصية بتغيير العلاج.`
          : `Hello ${profile.name || ""} 👋

I am your SugarCare AI Assistant.

📊 Recorded data summary:
- Average glucose: ${average} mg/dL
- Highest reading: ${highest} mg/dL
- Lowest reading: ${lowest} mg/dL
- Readings today: ${todayCount}
- Active medications: ${medications.length}

I can help summarize and explain trends from the data recorded in the application.

⚠️ These insights are for tracking and educational purposes only and do not replace professional medical advice.`;

      return res.json({
        reply,
        source: "fallback_engine",
      });
    }

    // ------------------------------------------------
    // Personalized patient context
    // ------------------------------------------------

    const patientContext = `
SUGARCARE AI USER DATA

Patient profile:
${JSON.stringify(profile)}

Recent glucose readings:
${JSON.stringify(recentReadings.slice(0, 20))}

Statistics:
${JSON.stringify(stats)}

Medications:
${JSON.stringify(medications)}

Meals:
${JSON.stringify(meals.slice(0, 10))}

Physical activity:
${JSON.stringify(activities.slice(0, 10))}

Recent weight records:
${JSON.stringify(weightRecords.slice(0, 10))}
`;

    const systemInstruction = `
You are SugarCare AI Assistant.

Respond in:
${language === "ar" ? "Arabic" : "English"}

IMPORTANT RULES:

1. SugarCare AI is a diabetes tracking and educational tool.
2. Do not diagnose diseases.
3. Do not prescribe medication.
4. Do not recommend changing medication doses.
5. Do not recommend changing insulin doses.
6. Do not tell the user to stop prescribed treatment.
7. Use the user's recorded application data when answering questions about their history.
8. Clearly distinguish recorded facts from general educational information.
9. Encourage consultation with a qualified healthcare professional for treatment decisions or concerning readings.
10. Keep responses concise and easy to understand.
`;

    const conversationHistory = history
      .map(
        (item: any) =>
          `${item.role === "user" ? "User" : "Assistant"}: ${
            item.text || ""
          }`
      )
      .join("\n");

    const prompt = `
${patientContext}

Conversation history:
${conversationHistory}

Current user question:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      reply:
        response.text ||
        (language === "ar"
          ? "أنا هنا لمساعدتك في متابعة بيانات السكر."
          : "I am here to help you understand your recorded diabetes data."),
      source: "gemini",
    });
  } catch (error: any) {
    console.error("SugarCare AI chat error:", error);

    return res.status(500).json({
      error: "Failed to generate AI response",
      details: error?.message || "Unknown error",
    });
  }
});

// ----------------------------------------------------
// AI Insights
// ----------------------------------------------------

app.post("/api/generate-insights", async (req, res) => {
  try {
    const {
      userContext = {},
      language = "en",
    } = req.body;

    const ai = getAIClient();

    /*
     * Do not create fake health statistics when no AI key
     * is configured.
     */
    if (!ai) {
      return res.json({
        insights: [],
        source: "fallback_engine",
        message:
          language === "ar"
            ? "أدخل المزيد من بياناتك للحصول على تحليلات مخصصة."
            : "Record more health data to receive personalized insights.",
      });
    }

    const prompt = `
Analyze the following diabetes tracking data:

${JSON.stringify(userContext)}

Language:
${language === "ar" ? "Arabic" : "English"}

Generate up to four concise observations.

Rules:
- Observational and educational only.
- No diagnosis.
- No medication or insulin dose changes.
- Do not invent missing health data.
- If data is insufficient, say so.
- Use only the data supplied above.

Return JSON array only.

Each object must contain:
{
  "id": "string",
  "category": "glucose_stability | nutrition_impact | medication_adherence | physical_activity",
  "title": "string",
  "description": "string",
  "type": "positive | warning | info"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let insights: any[] = [];

    try {
      insights = JSON.parse(response.text || "[]");
    } catch {
      insights = [];
    }

    return res.json({
      insights,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("SugarCare AI insights error:", error);

    return res.status(500).json({
      error: "Failed to generate AI insights",
      details: error?.message || "Unknown error",
    });
  }
});

// ----------------------------------------------------
// Frontend
// ----------------------------------------------------

async function configureFrontend() {
  /*
   * K_SERVICE exists automatically inside Google Cloud Run.
   *
   * Cloud Run must serve the already-built Vite application.
   * Locally, AI Studio can use Vite middleware.
   */

  const isCloudRun = Boolean(process.env.K_SERVICE);
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("Starting Vite development middleware...");

    const { createServer: createViteServer } = await import("vite");

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);

    return;
  }

  console.log("Starting SugarCare AI in production mode...");

  const distPath = path.resolve(process.cwd(), "dist");

  app.use(express.static(distPath));

  /*
   * SPA fallback.
   * Using app.use avoids Express/path-to-regexp wildcard
   * compatibility problems.
   */
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(path.join(distPath, "index.html"));
  });
}

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------

async function startServer() {
  try {
    await configureFrontend();

    app.listen(PORT, HOST, () => {
      console.log("------------------------------------------");
      console.log("SugarCare AI started successfully");
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Cloud Run: ${Boolean(process.env.K_SERVICE)}`);
      console.log(`Listening on ${HOST}:${PORT}`);
      console.log("------------------------------------------");
    });
  } catch (error) {
    console.error("SugarCare AI failed to start:", error);
    process.exit(1);
  }
}

startServer();