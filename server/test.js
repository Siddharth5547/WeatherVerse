require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const models = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3-pro-preview",
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

async function testModel(model) {
  try {
    console.log(`\nTesting: ${model}`);

    const result = await ai.models.generateContent({
      model,
      contents: "Say only: Hello from Gemini",
    });

    console.log("✅ SUCCESS");
    console.log(result.text);
    return true;
  } catch (err) {
    console.log("❌ FAILED");

    if (err.error) {
      console.log(JSON.stringify(err.error, null, 2));
    } else {
      console.log(err.message);
    }

    return false;
  }
}

(async () => {
  console.log("========== MODEL TEST ==========");

  for (const model of models) {
    const ok = await testModel(model);

    if (ok) {
      console.log("\n🎉 WORKING MODEL FOUND:");
      console.log(model);
      process.exit(0);
    }
  }

  console.log("\n❌ No working model found.");
})();