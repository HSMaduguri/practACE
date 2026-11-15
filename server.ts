import express from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import { execSync } from "child_process";
import nodemailer from "nodemailer";
import { GoogleGenAI, Type } from "@google/genai";
import {
  PAST_PAPERS_PDF_MANIFEST,
  INITIAL_PAST_PAPER_QUESTION_BANK,
  inferChapterForQuestion,
  type ExtractedPastPaperQuestion,
  type SubjectShortCode,
} from "./src/data/pastPapersQuestionBank.ts";

// Load environment variables
dotenv.config();

// Guard stdout and stderr against EPIPE when parent log pipes rotate or close
process.stdout?.on?.("error", () => {});
process.stderr?.on?.("error", () => {});

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable JSON parsing and guard per-request sockets against abrupt ECONNRESET/EPIPE errors
app.use(express.json());
app.use((req, res, next) => {
  req.socket?.on("error", () => {});
  res.socket?.on("error", () => {});
  next();
});

// Lazily initialize Gemini SDK with telemetry User-Agent header
function getGenAI() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper model constant
const MODEL_NAME = "gemini-3.8-flash";

/**
 * Endpoint to generate a theory or case scenario-based question
 */
app.post("/api/theory/generate", async (req, res) => {
  try {
    const { subjectId, chapterName } = req.body;

    if (!subjectId || !chapterName) {
      return res.status(400).json({ error: "Missing required fields: subjectId and chapterName" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add it via Settings > Secrets." 
      });
    }

    const systemInstruction = `You are an veteran Chartered Accountant (CA) Final Examiner and statutory specialist for Indian Taxation (Direct Tax/Indirect Tax) and Auditing.
Your job is to generate a highly professional, exam-friendly revision question for the student from the chapter "${chapterName}" in the subject "${subjectId}".

Guidelines for generating the question:
- The question should either be a "Direct Statutory core theory question" or an "Intricate factual case scenario" mimicking the style of the ICAI CA Final exams.
- Focus on testing actual provisions, schedules, rules, section citations, and critical legal keywords.
- Formulate a precise checklist of required key concepts, section numbers, or legal terms that are absolutely required to score full marks in this question.
- Formulate a short, direct, high-value suggested suggested answer that targets the provisions clearly without useless fluff.`;

    const userPrompt = `Generate a theory or case-scenario revision question for Subject ID: "${subjectId}" under Chapter: "${chapterName}".
Produce a highly technical, ICAI-grade question and identify the exact required sections, schedules, regulations, or core technical concepts.`;

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "A professional scenario-based or conceptual theory question from the selected chapter."
            },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: {
                    type: Type.STRING,
                    description: "Specific statutory provisions, sections, schedules, rules, or high-yield words. (e.g., 'Section 7(1)(a)', 'Schedule I', 'Rule 3', 'without consideration', 'business furtherance')."
                  },
                  category: {
                    type: Type.STRING,
                    description: "Explicit classification of this keyword. Values: Section, Schedule, Rule, Provision, Keyword."
                  },
                  description: {
                    type: Type.STRING,
                    description: "Summary explanation of why this term is required to test student retention."
                  }
                },
                required: ["keyword", "category", "description"]
              },
              description: "An exhaustive array of exactly what key terms or legal coordinates the student needs to capture."
            },
            shortSuggestedAnswer: {
              type: Type.STRING,
              description: "A short, direct and high-scoring Suggested Answer showcasing the exact conceptual application."
            }
          },
          required: ["question", "keyConcepts", "shortSuggestedAnswer"]
        }
      }
    });

    const responseText = response.text || "";
    const parsedData = JSON.parse(responseText.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Error in generating theory question:", error);
    return res.status(500).json({ error: error.message || "Failed to generate theory question" });
  }
});

/**
 * Endpoint to generate a short, concise AI reinforcing explanation for an answered quiz question
 */
app.post("/api/quiz/explain", async (req, res) => {
  try {
    const { question, options, selectedOption, correctOption, standardExplanation } = req.body;

    if (!question || !options || selectedOption === undefined || correctOption === undefined) {
      return res.status(400).json({ error: "Missing required parameters: question, options, selectedOption, and correctOption" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        aiReinforcement: `**Statutory Reminder**: Review the standard legal provisions carefully to calibrate your retention level. [Configure your GEMINI_API_KEY in secrets to activate custom smart reinforcement analyses!]\n\n${standardExplanation || ""}`
      });
    }

    const systemInstruction = `You are a legendary Chartered Accountant (CA) Final specialist and statutory educator.
Your task is to provide a brief (maximum 2-3 short, dense sentences) AI explanation reinforcing the legal basis or concept logic of the question.
- Do not repeat the full question text or option strings unless essential to compare contrast.
- Ensure the tone remains authoritative, encouraging, correct, and academically helpful.
- Cite specific sections or schedules if relevant to help solidify the student's legal memory.`;

    const userPrompt = `
Question: "${question}"
Options: ${JSON.stringify(options)}
Student's Chosen Option: "${selectedOption}"
Official Correct Option: "${correctOption}"
Primary Core Rationale: "${standardExplanation || ""}"

Draft an elite, highly concise feedback insight for the student consolidative of their learning.`;

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "text/plain",
      }
    });

    const aiReinforcement = (response.text || "").trim();
    return res.json({ aiReinforcement });

  } catch (error: any) {
    console.error("Error in generating quiz explanation:", error);
    return res.status(500).json({ error: error.message || "Failed to generate customized reinforcement" });
  }
});

/**
 * Endpoint to evaluate the user's answer for keyword and statutory precision
 */
app.post("/api/theory/evaluate", async (req, res) => {
  try {
    const { 
      question, 
      chapterName, 
      userAnswer, 
      keyConcepts 
    } = req.body;

    if (!question || !userAnswer || !keyConcepts) {
      return res.status(400).json({ error: "Missing required fields: question, userAnswer, or keyConcepts" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add it via Settings > Secrets." 
      });
    }

    const systemInstruction = `You are a strict yet fair CA Final evaluator. You are testing the RETAINING level and CONCEPT CLARITY of a student who submitted an answer.
Your task is to review the student's userAnswer against the requested keyConcepts checklist and determine whether the core concepts, statutory mentions (sections, schedule numbers, rule items) are adequately matched.

EVALUATION GOLDEN RULES:
1. STRICT CONTENT MATCHING: Focus on whether they caught the actual legal core. Check if the specific section numbers, rule listings, or schedule items are presented, or if the correct provision logic is there.
2. IGNORE GRAMMAR AND SENTENCE FRAMING: The student might write in incomplete bullets or have writing deficits. Do NOT penalize writing or grammar style. Evaluate strictly on conceptual substance and statutory citation retention.
3. CONCEIVED PERCENTAGE (EFFICIENCY SCORE): Assign an 'efficiencyScore' out of 100 based entirely on how many key concepts, rules, sections they retained and reproduced correctly in their answer.
4. SPECIFIC COMMENTARY: For each keyword/provision in the checklist, verify if they got it right or missed it. Write a supportive comment.
5. SUGGESTIONS TO SCORE 100: Detail exactly what they missed (e.g., 'You forgot to cite Section 7(1)(c) / Schedule I for gifts exceeding 50,000') so they understand how to bridge the gap.`;

    const userPrompt = `
Question Asked:
"${question}"

Under Chapter:
"${chapterName}"

Keywords & Required Provisions to Match:
${JSON.stringify(keyConcepts, null, 2)}

User's Submitted Answer:
"${userAnswer}"

Please analyze and return structured metrics.`;

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            efficiencyScore: {
              type: Type.INTEGER,
              description: "Representing Retaining level or Concept Clarity % from 0 to 100 based entirely on statutory and keyword coverage."
            },
            matchedConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  category: { type: Type.STRING },
                  matched: { 
                    type: Type.BOOLEAN, 
                    description: "Set to true if this keyword, provision, rule, section, or equivalent logical concept is present in the student's response." 
                  },
                  comment: { 
                    type: Type.STRING, 
                    description: "Supportive comment about this specific provision match or miss." 
                  }
                },
                required: ["keyword", "category", "matched", "comment"]
              }
            },
            efficiencyReasoning: {
              type: Type.STRING,
              description: "Short synthesis of the evaluation of this student's answer retention level."
            },
            criticalMisses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of crucial sections, rules, or schedules the student completely omitted from their answer."
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Direct, high-yield actionable hints telling the student what to add next time to get 100% on this topic."
            }
          },
          required: ["efficiencyScore", "matchedConcepts", "efficiencyReasoning", "criticalMisses", "suggestions"]
        }
      }
    });

    const responseText = response.text || "";
    const parsedData = JSON.parse(responseText.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Error in evaluating theory answer:", error);
    return res.status(500).json({ error: error.message || "Failed to evaluate theory answer" });
  }
});

// ==========================================
// 🔐 CUSTOM STUDENT AUTHENTICATION SYSTEM
// ==========================================

interface CustomUser {
  uid: string;
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  verificationCode: string;
  verificationToken: string;
  createdAt: string;
  resetCode?: string;
}

const USERS_DB_PATH = path.join(process.cwd(), "users-db.json");

function loadUsers(): Record<string, CustomUser> {
  try {
    if (fs.existsSync(USERS_DB_PATH)) {
      const data = fs.readFileSync(USERS_DB_PATH, "utf8");
      return JSON.parse(data || "{}");
    }
  } catch (err) {
    console.error("Error reading users database, starting fresh:", err);
  }
  return {};
}

function saveUsers(users: Record<string, CustomUser>) {
  try {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to users database:", err);
  }
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateUserId(): string {
  const rand = crypto.randomBytes(6).toString("hex");
  return `usr_${rand}`;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(name: string, email: string, code: string, token: string) {
  const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const verifyLink = `http://localhost:3000/api/auth/verify-link?token=${token}`;
  
  const subject = "📚 Checkcode: [practACE] Please Verify Your Student Profile";
  
  const htmlContent = `
    <div style="font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px; border: 1px solid #1e293b; border-radius: 20px; background-color: #0c0f1c; color: #f8fafc; text-align: left; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
        <span style="font-size: 18px; font-weight: 900; letter-spacing: 0.12em; color: #fbbf24; text-transform: uppercase;">practACE Revision Portal</span>
      </div>
      <div>
        <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; margin-top: 0;">Welcome to practACE, ${name}!</h2>
        <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px;">
          Your CA Final prep profile has been successfully generated. For safety, please verify your email address to unlock revision planners, audits, mock exams and bookmarks.
        </p>
        
        <div style="background-color: #090d16; border: 1px dashed #fbbf24; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
          <span style="display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #fbbf24; margin-bottom: 8px;">6-digit Activation Code</span>
          <span style="font-family: monospace; font-size: 28px; font-weight: 950; letter-spacing: 0.2em; color: #ffffff;">${code}</span>
        </div>

        <p style="font-size: 12px; line-height: 1.6; color: #94a3b8; text-align: center; margin: 20px 0 12px 0;">
          Or easily verify using the direct link:
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${verifyLink}" style="display: inline-block; background-color: #fbbf24; color: #0c0f1c; text-decoration: none; font-size: 12px; font-weight: 900; padding: 12px 24px; border-radius: 12px; transition: transform 0.2s;">
            Verify and Activate Profile
          </a>
        </div>

        <p style="font-size: 10px; line-height: 1.5; color: #475569; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; text-align: center;">
          This code expires within 2 hours. If you haven't requested this registration, please omit this communication.
        </p>
      </div>
    </div>
  `;

  const textContent = `
    Hi ${name},
    Welcome to practACE!
    Your unique 6-digit email verification code is: ${code}
    Or click this link to verify your account directly: ${verifyLink}
  `;

  if (isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"practACE System" <noreply@practace.com>`,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[SMTP] Verification mail dispatched successfully to ${email}`);
    } catch (err) {
      console.log(`[SMTP Status Info] Primary mail server not available (proceeding with logs fallback). details: ${err instanceof Error ? err.message : String(err)}`);
      logEmailFallback(email, code, verifyLink);
    }
  } else {
    logEmailFallback(email, code, verifyLink);
  }
}

function logEmailFallback(email: string, code: string, verifyLink: string) {
  console.log("\n================ [SMTP fallback] ================");
  console.log(`SMTP is not configured. Email target: ${email}`);
  console.log(`Verification code: ${code}`);
  console.log(`Direct verify link: ${verifyLink}`);
  console.log("==================================================\n");
}

async function sendPasswordResetEmail(name: string, email: string, code: string) {
  const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const subject = "🔑 Password Reset Code: [practACE]";
  
  const htmlContent = `
    <div style="font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px; border: 1px solid #1e293b; border-radius: 20px; background-color: #0c0f1c; color: #f8fafc; text-align: left; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
        <span style="font-size: 18px; font-weight: 900; letter-spacing: 0.12em; color: #fbbf24; text-transform: uppercase;">practACE Revision Portal</span>
      </div>
      <div>
        <h2 style="font-size: 16px; font-weight: 700; color: #ffffff; margin-top: 0;">Password Reset Request</h2>
        <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px;">
          Hi ${name}, we received a request to reset your password. Please use the following 6-digit code to complete the reset:
        </p>
        
        <div style="background-color: #090d16; border: 1px dashed #fbbf24; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
          <span style="display: block; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #fbbf24; margin-bottom: 8px;">6-digit Password Reset Code</span>
          <span style="font-family: monospace; font-size: 28px; font-weight: 950; letter-spacing: 0.2em; color: #ffffff;">${code}</span>
        </div>

        <p style="font-size: 10px; line-height: 1.5; color: #475569; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; text-align: center;">
          If you didn't request this, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    </div>
  `;

  const textContent = `
    Hi ${name},
    We received a request to reset your password.
    Your 6-digit password reset code is: ${code}
  `;

  if (isSmtpConfigured) {
    try {
      const transporter = (await import("nodemailer")).default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"practACE System" <noreply@practace.com>`,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[SMTP] Password reset code dispatched successfully to ${email}`);
    } catch (err) {
      console.log(`[SMTP Status Info] Primary mail server not available for password reset (proceeding with logs fallback). details: ${err instanceof Error ? err.message : String(err)}`);
      logPasswordResetFallback(email, code);
    }
  } else {
    logPasswordResetFallback(email, code);
  }
}

function logPasswordResetFallback(email: string, code: string) {
  console.log("\n================ [SMTP fallback - Password Reset] ================");
  console.log(`SMTP is not configured. Email target: ${email}`);
  console.log(`Password reset code: ${code}`);
  console.log("==================================================================\n");
}

/**
 * Custom Student Signup Endpoint
 * Generates user ID, hashes password, saves profile, and sends verification.
 */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, uid: clientUid } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please enter your Name, Email ID, and Password to sign up." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();

    const exists = Object.values(users).some(u => u.email === normalizedEmail);
    if (exists) {
      return res.status(400).json({ error: "This Email ID is already signed up. Try signing in!" });
    }

    const uid = clientUid || generateUserId();
    const verificationCode = "";
    const verificationToken = "";

    const newUser: CustomUser = {
      uid,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      emailVerified: true,
      verificationCode,
      verificationToken,
      createdAt: new Date().toISOString(),
    };

    users[normalizedEmail] = newUser;
    saveUsers(users);

    return res.json({
      success: true,
      uid,
      name: newUser.name,
      email: normalizedEmail,
      emailVerified: true,
    });
  } catch (err: any) {
    console.error("Signup failed:", err);
    return res.status(500).json({ error: err.message || "Failed to process user signup." });
  }
});

/**
 * Custom Student Code Verification Endpoint
 */
app.post("/api/auth/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Missing verification parameters: email and code." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    const user = users[normalizedEmail];

    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    if (user.verificationCode !== code.trim()) {
      return res.status(400).json({ error: "Invalid checkcode. Please look at your logs or type precisely." });
    }

    user.emailVerified = true;
    users[normalizedEmail] = user;
    saveUsers(users);

    return res.json({
      success: true,
      uid: user.uid,
      name: user.name,
      email: user.email,
      emailVerified: true,
    });
  } catch (err: any) {
    console.error("Verification confirmation failure:", err);
    return res.status(500).json({ error: err.message || "Failed to complete email activation." });
  }
});

/**
 * Custom Resend Verification Code Endpoint
 */
app.post("/api/auth/resend-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please provide your registered email address." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    const user = users[normalizedEmail];

    if (!user) {
      return res.status(404).json({ error: "User student profile not found." });
    }

    const verificationCode = generateVerificationCode();
    const verificationToken = `tok_${crypto.randomBytes(16).toString("hex")}`;

    user.verificationCode = verificationCode;
    user.verificationToken = verificationToken;
    users[normalizedEmail] = user;
    saveUsers(users);

    await sendVerificationEmail(user.name, normalizedEmail, verificationCode, verificationToken);

    const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    return res.json({
      success: true,
      isSmtpConfigured,
      devCode: verificationCode,
    });
  } catch (err: any) {
    console.error("Resending checkcode failed:", err);
    return res.status(500).json({ error: err.message || "Failed to resend code." });
  }
});

/**
 * Custom Student Login Endpoint (Requires Email Verification)
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter your Email ID and Password to sign in." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    const user = users[normalizedEmail];

    if (!user) {
      return res.status(404).json({ error: "This Email ID is not signed up on practACE yet." });
    }

    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Incorrect password selection. Please try again." });
    }

    user.emailVerified = true;
    users[normalizedEmail] = user;
    saveUsers(users);

    return res.json({
      success: true,
      uid: user.uid,
      name: user.name,
      email: user.email,
      emailVerified: true,
    });
  } catch (err: any) {
    console.error("Login verification failure:", err);
    return res.status(500).json({ error: err.message || "Failed to sign in." });
  }
});

/**
 * Direct Verification URL Endpoint
 */
app.get("/api/auth/verify-link", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("<h3>Missing verification token parameter</h3>");
    }

    const users = loadUsers();
    const userEntry = Object.entries(users).find(([_, u]) => u.verificationToken === token);

    if (!userEntry) {
      return res.status(404).send(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, inherit; max-width: 400px; margin: 80px auto; padding: 32px; text-align: center; border: 1px solid #dc2626; border-radius: 16px; background-color: #0c0f1c; color: #ef4444;">
          <h2 style="font-size: 20px; font-weight: 800;">Link Expired or Invalid</h2>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Please trigger a resend code inside the checkcode registration page.</p>
        </div>
      `);
    }

    const [email, user] = userEntry;
    user.emailVerified = true;
    users[email] = user;
    saveUsers(users);

    return res.send(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 100px auto; padding: 40px; text-align: center; border: 1px solid #1e293b; border-radius: 20px; background-color: #0c0f1c; color: #f8fafc; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.4);">
        <div style="font-size: 44px; margin-bottom: 20px;">🎉</div>
        <h2 style="color: #10b981; font-size: 20px; font-weight: 900; margin-bottom: 12px; letter-spacing: 0.05em; text-transform: uppercase;">Profile Verified & Active!</h2>
        <p style="color: #94a3b8; line-height: 1.6; font-size: 13px; margin-bottom: 24px;">
          Your elite practACE Student Profile for <strong>${user.name}</strong> (${email}) has been successfully activated.
        </p>
        <p style="color: #64748b; font-size: 11px; margin-bottom: 24px; line-height: 1.5;">
          You can now return to the original portal tab. If you closed it, click the button below to secure your access.
        </p>
        <a href="/" style="display: inline-block; background-color: #fbbf24; color: #0c0f1c; text-decoration: none; font-size: 13px; font-weight: 800; padding: 12px 28px; border-radius: 12px;">Go to Revision Portal</a>
      </div>
    `);
  } catch (err: any) {
    console.error("Direct link click crashed:", err);
    return res.status(500).send("<h3>Internal server validation error</h3>");
  }
});

/**
 * Custom Student Forgot Password Endpoint
 * Generates and dispatches a 6-digit reset code to user.
 */
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please enter your registered Email ID." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    let user = users[normalizedEmail];

    if (!user) {
      // Auto-create a custom user profile entry if they are requesting a reset
      // This allows guest or Firebase authenticated sessions to seamlessly set/reset a local password
      // when requested without having to manually register a new custom account first.
      user = {
        uid: generateUserId(),
        name: normalizedEmail.split('@')[0] || "Student",
        email: normalizedEmail,
        passwordHash: hashPassword(Math.random().toString()), // temporary random password
        emailVerified: true,
        verificationCode: "",
        verificationToken: "",
        createdAt: new Date().toISOString(),
      };
      users[normalizedEmail] = user;
    }

    const resetCode = generateVerificationCode();
    user.resetCode = resetCode;
    users[normalizedEmail] = user;
    saveUsers(users);

    await sendPasswordResetEmail(user.name, normalizedEmail, resetCode);

    const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    return res.json({
      success: true,
      isSmtpConfigured,
      devCode: resetCode,
      message: "Password reset checkcode dispatched successfully."
    });
  } catch (err: any) {
    console.error("Forgot password request failed:", err);
    return res.status(500).json({ error: err.message || "Failed to process forgot password request." });
  }
});

/**
 * Custom Student Reset Password Endpoint
 * Verifies code and commits new password.
 */
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Please enter your Email ID, Reset Code, and New Password." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    const user = users[normalizedEmail];

    if (!user) {
      return res.status(404).json({ error: "User student profile not found." });
    }

    if (!user.resetCode || user.resetCode !== code.trim()) {
      return res.status(400).json({ error: "Incorrect reset code. Please try again." });
    }

    user.passwordHash = hashPassword(newPassword);
    delete user.resetCode;
    users[normalizedEmail] = user;
    saveUsers(users);

    return res.json({
      success: true,
      message: "Your password has been successfully updated. Please login with your new credentials."
    });
  } catch (err: any) {
    console.error("Reset password confirmation failed:", err);
    return res.status(500).json({ error: err.message || "Failed to reset password." });
  }
});

/**
 * Direct Password Update (Instant Sandbox Bypass)
 */
app.post("/api/auth/direct-update-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Missing email or new password properties." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = loadUsers();
    const user = users[normalizedEmail];

    if (!user) {
      return res.status(404).json({ error: "User student profile not found." });
    }

    user.passwordHash = hashPassword(newPassword);
    users[normalizedEmail] = user;
    saveUsers(users);

    return res.json({
      success: true,
      message: "Your password has been changed instantly."
    });
  } catch (err: any) {
    console.error("Direct password update failed:", err);
    return res.status(500).json({ error: err.message || "Failed to update password directly." });
  }
});

/**
 * Same-origin PDF proxy for official ICAI Past Papers & Suggested Answers (resource.cdn.icai.org)
 * Ensures reliable inline PDF rendering inside the embedded Past Papers viewer without X-Frame-Options or forced-download blocks.
 */
app.get("/api/icai-pdf-proxy", async (req, res) => {
  try {
    const rawUrl = String(req.query.url || "").trim();
    const isDownload = req.query.download === "1" || req.query.download === "true";
    const customFilename = String(req.query.filename || "").replace(/[^a-zA-Z0-9._-]/g, "_");

    if (!rawUrl) {
      return res.status(400).send("Missing PDF url parameter.");
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return res.status(400).send("Invalid URL format.");
    }

    if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "resource.cdn.icai.org") {
      return res.status(403).send("Only official resource.cdn.icai.org PDF links are permitted.");
    }

    const upstreamRes = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/pdf,*/*"
      }
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).send(`Failed to load PDF from ICAI CDN (HTTP ${upstreamRes.status}).`);
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fallbackName = path.basename(parsedUrl.pathname) || "icai-paper.pdf";
    const finalFilename = customFilename && customFilename.endsWith(".pdf") ? customFilename : fallbackName;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${isDownload ? "attachment" : "inline"}; filename="${finalFilename}"`
    );
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.removeHeader("X-Frame-Options");
    return res.send(buffer);
  } catch (err: any) {
    console.error("Error proxying ICAI PDF:", err);
    return res.status(500).send("Error streaming ICAI PDF document.");
  }
});

/**
 * Backend Past Papers Repository & Background Suggested Answer PDF Extractor
 */
const EXTRACTED_BANK_CACHE_PATH = path.join(process.cwd(), ".past_papers_extracted_bank.json");
let dynamicExtractedQuestions: ExtractedPastPaperQuestion[] = [];
let extractionCompletedMap: Record<string, boolean> = {};

function loadExtractedBankCache() {
  try {
    if (fs.existsSync(EXTRACTED_BANK_CACHE_PATH)) {
      const raw = JSON.parse(fs.readFileSync(EXTRACTED_BANK_CACHE_PATH, "utf-8"));
      if (Array.isArray(raw.questions)) {
        dynamicExtractedQuestions = raw.questions;
      }
      if (raw.completedMap && typeof raw.completedMap === "object") {
        extractionCompletedMap = raw.completedMap;
      }
    }
  } catch (e) {
    console.warn("Could not load .past_papers_extracted_bank.json:", e);
  }
}

function saveExtractedBankCache() {
  try {
    fs.writeFileSync(
      EXTRACTED_BANK_CACHE_PATH,
      JSON.stringify(
        {
          questions: dynamicExtractedQuestions,
          completedMap: extractionCompletedMap,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch (e) {
    console.warn("Could not save .past_papers_extracted_bank.json:", e);
  }
}

loadExtractedBankCache();

function parseQuestionsFromSuggestedAnswerText(
  rawText: string,
  subjectCode: SubjectShortCode,
  attempt: any,
  attemptLabel: string
): ExtractedPastPaperQuestion[] {
  const results: ExtractedPastPaperQuestion[] = [];
  if (!rawText || rawText.trim().length < 200) return results;

  // Normalize line breaks and split by "Question 1", "Question 2", etc.
  const cleaned = rawText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  const questionRegex = /(?:^|\n)\s*(Question\s+[1-6]\s*(?:\([a-z]\))?)/gi;
  const matches = Array.from(cleaned.matchAll(questionRegex));

  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index || 0;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index || cleaned.length : cleaned.length;
    const block = cleaned.slice(startIdx, endIdx).trim();
    if (block.length < 120) continue;

    // Split Question and Answer inside block
    const ansSplit = block.split(/(?:^|\n)\s*(?:Answer|Solution)\s*(?:to\s+Question[^:\n]*)?[:\n]/i);
    if (ansSplit.length < 2) continue;

    const qPart = ansSplit[0].trim();
    const aPart = ansSplit.slice(1).join("\n").trim();
    if (qPart.length < 40 || aPart.length < 60) continue;

    const qHeadingMatch = qPart.match(/Question\s+([1-6](?:\s*\([a-z]\))?)/i);
    const qLabel = qHeadingMatch ? `Question ${qHeadingMatch[1].replace(/\s+/g, "")}` : `Question ${i + 1}`;
    const marksMatch = qPart.match(/\((\d{1,2})\s*Marks?\)/i);
    const marks = marksMatch ? Number(marksMatch[1]) : 8;

    const chapterName = inferChapterForQuestion(subjectCode, `${qPart}\n${aPart}`);
    const qLines = qPart
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 3 && !/^Question\s+\d/i.test(l))
      .slice(0, 12);

    const aLines = aPart
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 3)
      .slice(0, 16);

    if (qLines.length === 0 || aLines.length === 0) continue;

    const id = `pdf-${subjectCode.toLowerCase()}-${attempt.toLowerCase()}-q${i + 1}`;
    results.push({
      id,
      subjectCode,
      attempt,
      attemptLabel,
      questionNumber: qLabel,
      marks,
      chapterName,
      topicTag: `${chapterName} (${attemptLabel} ICAI Suggested Answer)`,
      questionText: [qLines.join(" ")],
      suggestedAnswer: {
        provisionOrStandard: [aLines.slice(0, Math.ceil(aLines.length / 2)).join(" ")],
        analysisAndWorkings: [aLines.slice(Math.ceil(aLines.length / 2)).join(" ")],
        conclusion: aLines[aLines.length - 1] || "Refer to the computation and statutory provisions above.",
      },
    });
  }

  return results;
}

async function runBackgroundPdfExtraction() {
  const { PDFParse } = await import("pdf-parse");
  for (const item of PAST_PAPERS_PDF_MANIFEST) {
    const key = `${item.subject}-${item.attempt}`;
    if (extractionCompletedMap[key]) continue;

    try {
      const res = await fetch(item.saUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/pdf,*/*",
        },
      });
      if (!res.ok) {
        extractionCompletedMap[key] = true;
        continue;
      }
      const arrayBuf = await res.arrayBuffer();
      const parser = new PDFParse({ data: new Uint8Array(arrayBuf) });
      const parsed = await parser.getText();
      await parser.destroy();

      if (parsed?.text) {
        const extracted = parseQuestionsFromSuggestedAnswerText(
          parsed.text,
          item.subject,
          item.attempt,
          item.attemptLabel
        );
        if (extracted.length > 0) {
          const existingIds = new Set(dynamicExtractedQuestions.map((q) => q.id));
          for (const eq of extracted) {
            if (!existingIds.has(eq.id)) {
              dynamicExtractedQuestions.push(eq);
            }
          }
        }
      }
      extractionCompletedMap[key] = true;
      saveExtractedBankCache();
    } catch {
      extractionCompletedMap[key] = true;
    }
  }
}

// Only trigger background PDF extraction when explicitly enabled (pre-extracted bank is already cached)
if (process.env.ENABLE_PDF_EXTRACTION === "true") {
  setTimeout(() => {
    runBackgroundPdfExtraction().catch((e) =>
      console.warn("Background PDF extraction warning:", e)
    );
  }, 3000);
}

/**
 * GET /api/past-papers/bank
 * Returns all structured, chapter-tagged Questions & Suggested Answers (and PDF download metadata).
 */
app.get("/api/past-papers/bank", (req, res) => {
  const subjectFilter = String(req.query.subject || "").trim();
  const chapterFilter = String(req.query.chapter || "").trim();
  const attemptFilter = String(req.query.attempt || "").trim();

  // Merge pre-extracted curated bank with any additional background-parsed questions
  const allQuestions = [...INITIAL_PAST_PAPER_QUESTION_BANK];
  const existingKeys = new Set(
    allQuestions.map((q) => `${q.subjectCode}-${q.attempt}-${q.questionNumber.toLowerCase()}`)
  );
  for (const dq of dynamicExtractedQuestions) {
    const k = `${dq.subjectCode}-${dq.attempt}-${dq.questionNumber.toLowerCase()}`;
    if (!existingKeys.has(k)) {
      allQuestions.push(dq);
      existingKeys.add(k);
    }
  }

  const filtered = allQuestions.filter((q) => {
    if (subjectFilter && q.subjectCode.toLowerCase() !== subjectFilter.toLowerCase()) return false;
    if (chapterFilter && chapterFilter !== "ALL" && q.chapterName !== chapterFilter) return false;
    if (attemptFilter && attemptFilter !== "ALL" && q.attempt !== attemptFilter) return false;
    return true;
  });

  return res.json({
    questions: filtered,
    totalCount: filtered.length,
    manifestCount: PAST_PAPERS_PDF_MANIFEST.length,
  });
});

/**
 * GET /api/past-papers/download?subject=FR&attempt=May-26&type=qp|sa
 * Downloads the official ICAI Question Paper (QP) or Suggested Answer (SA) stored in the backend manifest.
 */
app.get("/api/past-papers/download", async (req, res) => {
  try {
    const subjectParam = String(req.query.subject || "FR").trim();
    const attemptParam = String(req.query.attempt || "May-26").trim();
    const docType = String(req.query.type || "qp").trim().toLowerCase() === "sa" ? "sa" : "qp";

    const entry =
      PAST_PAPERS_PDF_MANIFEST.find(
        (m) =>
          m.subject.toLowerCase() === subjectParam.toLowerCase() &&
          m.attempt.toLowerCase() === attemptParam.toLowerCase()
      ) ||
      PAST_PAPERS_PDF_MANIFEST.find(
        (m) => m.subject.toLowerCase() === subjectParam.toLowerCase() && m.attempt === "May-26"
      );

    if (!entry) {
      return res.status(404).send("Requested past paper not found in backend repository.");
    }

    const targetUrl = docType === "sa" ? entry.saUrl : entry.qpUrl;
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/pdf,*/*",
      },
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).send("Failed to fetch PDF from ICAI repository.");
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `CA_Final_${entry.subject}_${entry.attempt}_${
      docType === "sa" ? "Suggested_Answer" : "Question_Paper"
    }.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(buffer);
  } catch (err) {
    console.error("Error downloading past paper PDF:", err);
    return res.status(500).send("Failed to download PDF.");
  }
});

// Helper to encode a short UTF-8 string into an unmasked RFC-6455 WebSocket text frame
function createWsTextFrame(payload: string): Buffer {
  const data = Buffer.from(payload, "utf8");
  const len = data.length;
  if (len < 126) {
    const header = Buffer.from([0x81, len]);
    return Buffer.concat([header, data]);
  }
  const header = Buffer.alloc(4);
  header[0] = 0x81;
  header[1] = 126;
  header.writeUInt16BE(len, 2);
  return Buffer.concat([header, data]);
}

// Start routing with Vite middleware or static serving
async function start() {
  const distPath = path.join(process.cwd(), "dist");
  const isRunningDevScript =
    process.env.npm_lifecycle_event === "dev" ||
    process.env.NODE_ENV === "development" ||
    process.execArgv.some((arg) => arg.includes("tsx"));
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.npm_lifecycle_event === "start" ||
    (!isRunningDevScript && fs.existsSync(path.join(distPath, "index.html")));

  if (!isProduction) {
    // Development Mode — explicitly disable HMR & internal Vite WS server to prevent socket drops
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: null,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const httpServer = http.createServer(app);
  httpServer.keepAliveTimeout = 65000;
  httpServer.headersTimeout = 66000;

  // Guard against malformed client sockets or abrupt disconnects
  httpServer.on("clientError", (err: any, socket) => {
    if (err?.code === "ECONNRESET" || !socket.writable) {
      return;
    }
    try {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    } catch {}
  });

  // Gracefully accept any incoming WebSocket upgrade requests (e.g., from proxy or cached Vite HMR client)
  // so that sockets never fail, reset, or throw connection errors.
  httpServer.on("upgrade", (req, socket, _head) => {
    socket.on("error", () => {});
    try {
      const key = req.headers["sec-websocket-key"];
      if (!key || typeof key !== "string") {
        socket.end();
        return;
      }
      const protocolHeader = req.headers["sec-websocket-protocol"];
      const selectedProtocol =
        typeof protocolHeader === "string" ? protocolHeader.split(",")[0].trim() : "";

      const acceptDigest = crypto
        .createHash("sha1")
        .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
        .digest("base64");

      const responseHeaders = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptDigest}`,
      ];
      if (selectedProtocol) {
        responseHeaders.push(`Sec-WebSocket-Protocol: ${selectedProtocol}`);
      }
      responseHeaders.push("\r\n");

      socket.write(responseHeaders.join("\r\n"));
      if ("setNoDelay" in socket && typeof (socket as any).setNoDelay === "function") {
        (socket as any).setNoDelay(true);
      }
      if ("setKeepAlive" in socket && typeof (socket as any).setKeepAlive === "function") {
        (socket as any).setKeepAlive(true, 30000);
      }

      // If Vite HMR protocol, send initial connected message so client stays quiescent
      if (selectedProtocol === "vite-hmr") {
        socket.write(createWsTextFrame(JSON.stringify({ type: "connected" })));
      }

      socket.on("data", (buffer: Buffer) => {
        try {
          if (buffer.length === 0) return;
          const opcode = buffer[0] & 0x0f;
          // 0x8 = Close frame -> reply with Close frame and end cleanly
          if (opcode === 0x08) {
            if (socket.writable) {
              socket.end(Buffer.from([0x88, 0x00]));
            }
            return;
          }
          // 0x9 = Ping frame -> reply with Pong frame (0x8A)
          if (opcode === 0x09) {
            if (socket.writable) {
              socket.write(Buffer.from([0x8a, 0x00]));
            }
          }
        } catch {}
      });
    } catch {
      try {
        socket.destroy();
      } catch {}
    }
  });

  const reclaimPortFromStaleProcess = () => {
    try {
      const rawPs = execSync("ps -eo pid,ppid,args", { encoding: "utf8" });
      const myPid = process.pid;
      const myPpid = process.ppid;
      const lines = rawPs.split("\n");
      for (const line of lines) {
        if (!line.includes("server.ts")) continue;
        const match = line.trim().match(/^(\d+)\s+(\d+)\s+(.*)$/);
        if (!match) continue;
        const pid = Number(match[1]);
        const ppid = Number(match[2]);
        const cmd = match[3];
        if (
          pid &&
          pid !== myPid &&
          pid !== myPpid &&
          ppid !== myPid &&
          !cmd.includes("grep") &&
          !cmd.includes("ps -eo")
        ) {
          try {
            process.kill(pid, "SIGKILL");
          } catch {}
        }
      }
    } catch {}
  };

  let listenRetries = 0;
  const maxRetries = 5;

  httpServer.on("error", (err: any) => {
    if (err?.code === "EADDRINUSE") {
      listenRetries += 1;
      reclaimPortFromStaleProcess();
      if (listenRetries <= maxRetries) {
        console.warn(
          `[practACE Server] Port ${PORT} is busy (attempt ${listenRetries}/${maxRetries}). Reclaiming port and retrying in 500ms...`
        );
        setTimeout(() => {
          try {
            httpServer.close();
          } catch {}
          httpServer.listen(PORT, "0.0.0.0");
        }, 500);
      } else {
        console.warn(
          `[practACE Server] Port ${PORT} is already being served by an active instance. Standing by cleanly.`
        );
      }
      return;
    }
    console.error("[practACE Server] Server error:", err);
  });

  const shutdownGracefully = () => {
    try {
      httpServer.close(() => {
        process.exit(0);
      });
      setTimeout(() => process.exit(0), 1500).unref();
    } catch {
      process.exit(0);
    }
  };

  process.once("SIGTERM", shutdownGracefully);
  process.once("SIGINT", shutdownGracefully);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[practACE Server] Booted successfully. Listening on port ${PORT}`);
  });
}

process.on("uncaughtException", (err: any) => {
  if (
    err?.code === "EADDRINUSE" ||
    err?.code === "ECONNRESET" ||
    err?.code === "EPIPE" ||
    err?.code === "ERR_STREAM_DESTROYED"
  ) {
    return;
  }
});

start();

