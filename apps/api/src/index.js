require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth.routes');
const gamesRoutes = require('./routes/games.routes');
const queueRoutes = require('./routes/queue.routes');
const scoresRoutes = require('./routes/scores.routes');
const conciergeRoutes = require('./routes/concierge.routes');
const sessionRoutes = require('./routes/session.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');
app.use('/games', express.static(path.join(__dirname, '../../web/public/games')));

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/concierge', conciergeRoutes);
app.use('/api/session', sessionRoutes);
// Today's high score routes are simple enough to include here or in a separate file. 
// We'll put them in scores for now, or a new file.
const todaysHighScoreRoutes = require('./routes/todaysHighScore.routes');
app.use('/api/today-high-score', todaysHighScoreRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'THE ARCADE API (Firebase) is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
