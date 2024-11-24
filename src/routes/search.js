import express from 'express';
import { getSpotifyApi } from '../utils/tokenmanager.js';

const router = express.Router();

// Extended search
router.get('/search', async (req, res) => {
    const spotifyApi = getSpotifyApi();
    const { query, types } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const validTypes = ['track']; // 'album', 'artist', 'playlist'
    const searchTypes = types ? types.split(',').filter((type) => validTypes.includes(type)) : ['track'];

    if (searchTypes.length === 0) {
        return res.status(400).json({ error: 'Invalid type(s). Valid types are: track' });
    }

    try {
        const response = await spotifyApi.search(query, searchTypes);
        res.status(200).json(response.body);
    } catch (error) {
        console.error('Error performing search:', error.message);
        res.status(500).json({ error: 'Failed to perform search', details: error.message });
    }
});


export default router;
