const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /api/ai/session-message
router.post('/session-message', verifyToken, async (req, res) => {
  try {
    const { gamesPlayed, bestScore, totalTime } = req.body;

    const prompt = `A user just finished an arcade session. They played ${gamesPlayed} games, their best score was ${bestScore}, and they spent ${totalTime} minutes. Write exactly one encouraging sentence to motivate them to come back. Be fun and enthusiastic. Maximum 25 words.`;

    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    res.json({ success: true, data: { message } });
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Fallback message per specification
    res.json({
      success: true,
      data: { message: "Great session today! Keep pushing your limits." }
    });
  }
});

// POST /api/ai/recommend
router.post('/recommend', verifyToken, async (req, res) => {
  try {
    const { favouriteGenres, recentGames, availableGames } = req.body;

    const prompt = `Given a user who likes ${favouriteGenres} and recently played ${recentGames}, recommend ONE game from this list: ${availableGames}. Reply with only: {"game": "GameName", "reason": "one sentence reason"}. JSON only, no markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');

    const parsed = JSON.parse(text);

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Gemini Recommend Error:', error);
    // Fallback logic
    const fallbackGame = Array.isArray(availableGames) && availableGames.length > 0
      ? availableGames[0]
      : (typeof availableGames === 'string' ? availableGames.split(',')[0] : "Dragon Strike VR");

    res.json({
      success: true,
      data: {
        game: fallbackGame,
        reason: "It's one of our most popular games right now!"
      }
    });
  }
});

// POST /api/concierge/chat
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, history } = req.body;

    // Construct the context
    const systemInstruction = `You are Glitch, the pixel-ghost mascot and concierge for 'The Arcade'. You help people find games, check queues, and answer quick questions. Talk like a real staff member texting a regular: casual, warm, to the point. One or two short sentences max, no bullet lists, no over-explaining. Skip greetings if the conversation is already underway.`;

    // Format history for Gemini (roles: 'user' or 'model')
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Check if the key is the dummy key. If so, throw an error to trigger fallback.
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy-key") {
      throw new Error("Dummy API key detected. Using mock fallback.");
    }

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: "System Instructions: " + systemInstruction + " Acknowledge these instructions." }] },
        { role: 'model', parts: [{ text: "Understood. I am Glitch, The Arcade's virtual concierge." }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 60,
        temperature: 0.8,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text().trim();

    res.json({ success: true, data: { text: responseText } });
  } catch (error) {
    console.error('Gemini Chat Error:', error);

    // Smart Mock Fallback Logic
    const msg = req.body.message.toLowerCase();
    let responseText = "I'm Glitch -- ask me about games, queues, or wait times.";

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      responseText = "Hey! What do you feel like playing today?";
    } else if (msg.includes("game") || msg.includes("play")) {
      responseText = "Dragon Strike VR and Racing Thunder are the busiest right now -- both worth the wait.";
    } else if (msg.includes("wait") || msg.includes("queue") || msg.includes("time")) {
      responseText = "Pretty chill right now -- short wait on Basketball Pro, Dragon Strike VR's busier. Want me to add you to a queue?";
    } else if (msg.includes("yes") || msg.includes("sure")) {
      responseText = "Head to Discover and tap the game -- you're in.";
    } else if (msg.includes("map") || msg.includes("where")) {
      responseText = "Check the Map tab -- Dragon Strike VR's in Zone A, Zombie Survival's in Zone C.";
    }

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      success: true,
      data: { text: responseText }
    });
  }
});

module.exports = router;
