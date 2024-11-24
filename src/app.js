import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import loginRoute from './routes/login.js';
import callbackRoute from './routes/callback.js';
import profileRoute from './routes/profile.js';
import playerRoute from './routes/player.js';
import playlistRoute from './routes/playlist.js'
import searchRoute from './routes/search.js'

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Route-ok
app.use(loginRoute);
app.use(callbackRoute);
app.use(profileRoute);
app.use(playerRoute);
app.use(playlistRoute);
app.use(searchRoute);

// Szerver indítása
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
