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
      data: { message: "Great session today! Keep pushing your limits! 🎮" } 
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
      : (typeof availableGames === 'string' ? availableGames.split(',')[0] : "Neon Racer");
      
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
    const systemInstruction = `You are the friendly, helpful Virtual Concierge for 'The Arcade'. You help users with queueing, finding games, and answering FAQs. Keep responses short and conversational.`;
    
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
        { role: 'model', parts: [{ text: "Understood. I am The Arcade Virtual Concierge." }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 150,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text().trim();
    
    res.json({ success: true, data: { text: responseText } });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    
    // Smart Mock Fallback Logic
    const msg = req.body.message.toLowerCase();
    let responseText = "I'm your Virtual Concierge! I'm here to help you navigate the arcade. Try asking me about our current games or wait times!";
    
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      responseText = "Hey there! Ready to hit the arcade? I can help you find games or check queue times.";
    } else if (msg.includes("game") || msg.includes("play")) {
      responseText = "We have some awesome games today! Neon Racer and Zombie Blast are super popular right now. Have you tried them?";
    } else if (msg.includes("wait") || msg.includes("queue") || msg.includes("time")) {
      responseText = "Wait times are pretty chill right now! Pixel Punch has absolutely no wait, while Zombie Blast is about 15 minutes. Want me to add you to a queue?";
    } else if (msg.includes("yes") || msg.includes("sure")) {
      responseText = "Awesome! Just head over to the Discovery tab and tap on a game to join its queue.";
    } else if (msg.includes("map") || msg.includes("where")) {
      responseText = "You can find all games on the Map screen! Neon Racer is in Zone A, and Zombie Blast is down in Zone C.";
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
