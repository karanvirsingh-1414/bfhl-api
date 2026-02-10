require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const getFibonacci = (n) => {
    if (n < 0) return [];
    if (n === 0) return [0];
    if (n > 1000) throw new Error("Input too large (max 1000)");
    let fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
    }
    return fib;
};

const isPrime = (num) => {
    if (typeof num !== "number" || num === null) return false;
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const getPrimes = (arr) => {
    if (!Array.isArray(arr)) throw new Error("Invalid input for prime");
    return arr.filter((num) => isPrime(num));
};

const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
};

const getHCF = (arr) => {
    if (!Array.isArray(arr)) throw new Error("Invalid input for hcf");
    if (!arr.length) return 0;

    return arr.reduce((acc, curr) => {
        if (typeof curr !== "number" || curr === null) throw new Error("List contains non-numeric values");
        if (curr === 0) throw new Error("HCF cannot be calculated with zero");
        if (curr < 0) throw new Error("HCF input cannot be negative");
        return gcd(acc, curr);
    });
};

const getLCM = (arr) => {
    if (!Array.isArray(arr)) throw new Error("Invalid input for lcm");
    if (!arr.length) return 0;

    const lcm = (a, b) => {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / gcd(a, b);
    };

    return arr.reduce((acc, curr) => {
        if (typeof curr !== "number" || curr === null) throw new Error("List contains non-numeric values");
        if (curr === 0) throw new Error("LCM cannot be calculated with zero");
        if (curr < 0) throw new Error("LCM input cannot be negative");
        return lcm(acc, curr);
    });
};

const getAIResponse = async (question) => {
    try {
        const trimmedQuestion = (question || "").trim();
        if (!trimmedQuestion) throw new Error("AI question cannot be empty");

        const result = await model.generateContent(
            `Answer the following question in exactly one word: ${trimmedQuestion}`,
        );
        const response = await result.response;
        return response
            .text()
            .trim()
            .replace(/[^\w]|_/g, ""); // Simplified punctuation removal
    } catch (error) {
        console.error("AI Error Details:", error.message || error);
        throw error; // Let the main handler catch it
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

        if (keys.length === 0) {
            return res.status(400).json({
                is_success: false,
                official_email: OFFICIAL_EMAIL,
                error: "No valid key provided",
            });
        }

        if (keys.length > 1) {
            return res.status(400).json({
                is_success: false,
                official_email: OFFICIAL_EMAIL,
                error: "Only one key is allowed per request",
            });
        }

        const key = keys[0];
        const value = req.body[key];
        let data;

        switch (key) {
            case "fibonacci":
                if (typeof value !== "number") throw new Error("Invalid input for fibonacci");
                data = getFibonacci(value);
                break;
            case "prime":
                data = getPrimes(value);
                break;
            case "lcm":
                data = getLCM(value);
                break;
            case "hcf":
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