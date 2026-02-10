require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const getFibonacci = (n) => {
  if (n < 0) return [];
  if (n === 0) return [0];
  let fib = [0, 1];
  for (let i = 2; i <= n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
};

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const getPrimes = (arr) =>
  arr.filter((num) => typeof num === "number" && isPrime(num));

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const getHCF = (arr) => {
  if (!arr.length) return 0;
  return arr.reduce((acc, curr) => gcd(acc, curr));
};

const getLCM = (arr) => {
  if (!arr.length) return 0;
  const lcm = (a, b) => (a * b) / gcd(a, b);
  return arr.reduce((acc, curr) => lcm(acc, curr));
};

const getAIResponse = async (question) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "API Key missing";

    const result = await model.generateContent(
      `Answer the following question in exactly one word: ${question}`,
    );
    const response = await result.response;
    return response
      .text()
      .trim()
      .replace(/[^\w\s]|_/g, "")
      .split(/\s+/)[0];
  } catch (error) {
    console.error("AI Error Details:", error.message || error);
    return "Error";
  }
};

// GET /health
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const keys = Object.keys(req.body);

    // Validation: Exactly one key
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error:
          "Exactly one functional key required: fibonacci, prime, lcm, hcf, AI",
      });
    }

    const key = keys[0];
    const value = req.body[key];
    let data;

    switch (key) {
      case "fibonacci":
        if (typeof value !== "number" || value < 0)
          throw new Error("Invalid input for fibonacci");
        data = getFibonacci(value);
        break;
      case "prime":
        if (!Array.isArray(value)) throw new Error("Invalid input for prime");
        data = getPrimes(value);
        break;
      case "lcm":
        if (!Array.isArray(value)) throw new Error("Invalid input for lcm");
        data = getLCM(value);
        break;
      case "hcf":
        if (!Array.isArray(value)) throw new Error("Invalid input for hcf");
        data = getHCF(value);
        break;
      case "AI":
        if (typeof value !== "string") throw new Error("Invalid input for AI");
        data = await getAIResponse(value);
        break;
      default:
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Invalid functional key",
        });
    }

    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
