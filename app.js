/**
 * app.js
 * Daily French Word Telex/Mastra agent (Express).
 *
 * - POST /mastra/agent  -> receives Telex A2A payloads (Mastra node style)
 * - GET  /health        -> simple health check
 *
 * Usage:
 *   NODE_ENV=development PORT=3000 npm start
 *
 * Notes:
 * - Expose this publicly (ngrok) and set the Telex Mastra node "url" to: https://<ngrok>.ngrok.io/mastra/agent
 * - Telex will POST an A2A payload; we respond with JSON that contains text and optional actions.
 */

import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Simple in-memory list of french words.
 * In production, store in DB with progress tracking per user.
 */
const WORDS_FILE = path.join(process.cwd(), "french_words.json");

// Load words list (fallback to small default array if file missing)
let WORDS = [
  { word: "bonjour", meaning: "hello (good day)", example: "Bonjour! Comment ça va?", pron: "bohn-zhoor" },
  { word: "merci", meaning: "thank you", example: "Merci pour ton aide.", pron: "mehr-see" },
  { word: "s'il vous plaît", meaning: "please", example: "Un café, s'il vous plaît.", pron: "seel voo pleh" },
  { word: "amour", meaning: "love", example: "L'amour est beau.", pron: "ah-moor" },
  { word: "chien", meaning: "dog", example: "Le chien court dans le parc.", pron: "shee-en" },
  { word: "chat", meaning: "cat", example: "Le chat dort sur la chaise.", pron: "sha" }
];

// If user provided a list in french_words.json, use it
if (fs.existsSync(WORDS_FILE)) {
  try {
    const raw = fs.readFileSync(WORDS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) WORDS = parsed;
  } catch (e) {
    console.warn("Could not load french_words.json, using default list.");
  }
}

/**
 * Simple persistence of "last index" per channel (file-backed).
 * Keyed by telex channel id (so each channel gets its own daily rotation).
 * For production: use real DB (Redis / Postgres).
 */
const PROGRESS_FILE = path.join(process.cwd(), "progress.json");
let PROGRESS = {};
if (fs.existsSync(PROGRESS_FILE)) {
  try { PROGRESS = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8")); } catch (e) { PROGRESS = {}; }
}
function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(PROGRESS, null, 2));
}

/**
 * pickNextWord(channelId): returns {index, wordObj}
 * cycles through WORDS for each channel.
 */
function pickNextWord(channelId) {
  const total = WORDS.length;
  if (!PROGRESS[channelId]) PROGRESS[channelId] = { index: 0, last_sent: null };
  // simple rotation: use index then increment
  const idx = PROGRESS[channelId].index % total;
  PROGRESS[channelId].index = (PROGRESS[channelId].index + 1) % total;
  PROGRESS[channelId].last_sent = new Date().toISOString();
  saveProgress();
  return { index: idx, wordObj: WORDS[idx] };
}

/**
 * buildResponsePayload(telexPayload, text, suggestions)
 * Returns structure Telex/Mastra expects for A2A replies.
 * Telex expects a JSON body; we'll provide a minimal safe structure.
 */
function buildResponsePayload(original, text, askForSentence = true) {
  // original may carry channel/user info in different fields. We'll echo back.
  const payload = {
    // The exact fields required by Telex Mastra node can vary;
    // a simple structure with "type":"message" and "text" is usually acceptable.
    type: "message",
    text,
    // option to include UI actions:
    actions: askForSentence ? [
      { type: "button", title: "I'll use it now", payload: "I used the word: " },
      { type: "button", title: "Send a sentence later", payload: "send later" }
    ] : []
  };

  return payload;
}

/**
 * POST /mastra/agent
 * Entrypoint for Telex Mastra a2a node.
 * Telex will POST a JSON payload describing the event and user/channel context.
 */
app.post("/mastra/agent", async (req, res) => {
  try {
    //https://boltless-isa-gnatlike.ngrok-free.dev/mastra/agent
    const body = req.body || {};
    // Telex sends a variety of shapes; commonly you'll find:
    //   body?.channel?.id or body?.channelId or body?.address
    // For safety, extract channel id from multiple possible places:
    const channelId =
      body?.channel?.id ||
      body?.channelId ||
      (typeof body?.address === "string" ? body.address.split("/")[0] : null) ||
      body?.metadata?.channelId ||
      "global";

    // Understand incoming user message if any
    const incomingText = (body?.text || body?.message || body?.content || "").toString().trim().toLowerCase();

    // If user asks "use my sentence" or sends a sentence, do simple acknowledgement
    if (incomingText && incomingText.length > 0 && incomingText !== "daily word" && !["start","help"].includes(incomingText)) {
      // A simple heuristic: if user mentions the french word back, praise them.
      const lastIndex = PROGRESS[channelId]?.index ? (PROGRESS[channelId].index + WORDS.length - 1) % WORDS.length : null;
      const lastWord = lastIndex !== null ? WORDS[lastIndex].word : null;
      let replyText = "Thanks for your sentence! Great attempt.";
      if (lastWord && incomingText.includes(lastWord)) {
        replyText = `Amazing — you used the word "${lastWord}" correctly! Très bien 🎉\nWould you like another word tomorrow?`;
      } else {
        replyText = `Thanks — nice try! Here's a tip: include the new word in your sentence (e.g., "${lastWord ? WORDS[lastIndex].example : 'example'}").`;
      }
      return res.json(buildResponsePayload(body, replyText, false));
    }

    // Otherwise pick the next daily word
    const { index, wordObj } = pickNextWord(channelId);
    const composed = `🇫🇷 *Word of the day* — *${wordObj.word}*\nPronunciation: ${wordObj.pron}\nMeaning: ${wordObj.meaning}\nExample: ${wordObj.example}\n\nCan you write a sentence using *${wordObj.word}*? Reply here and I'll give feedback!`;

    // Respond with JSON expected by Telex Mastra node
    return res.json(buildResponsePayload(body, composed, true));
  } catch (err) {
    console.error("Agent error:", err);
    return res.status(500).json({ error: "Agent internal error" });
  }
});

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Mastra-compatible Telex agent running on port ${PORT}`);
  console.log(`POST /mastra/agent is the A2A entrypoint.`);
});
