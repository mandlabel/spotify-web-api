import express from 'express';
import { getSpotifyApi } from '../utils/tokenmanager.js';

const router = express.Router();
const spotifyApi = getSpotifyApi();

router.get('/profile', async (req, res) => {
    try {
        const userProfile = await spotifyApi.getMe();
        res.json({
            country: userProfile.body.country,
            display_name: userProfile.body.display_name,
            email: userProfile.body.email,
            uri: userProfile.body.uri
        });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
    }
});

export default router;
