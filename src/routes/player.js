import express from 'express';
import { getSpotifyApi } from '../utils/tokenmanager.js';

const router = express.Router();
const spotifyApi = getSpotifyApi();

// Get Player State
router.get('/player/current', async (req, res) => {
    
    try {
        const response = await spotifyApi.getMyCurrentPlaybackState();
        const result = {
            device: response.body.device
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error starting/resuming playback:', error.message);
        res.status(500).json({ error: 'Failed to start or resume playback', details: error.message });
    }
});

// Start or Resume playback
router.post('/player/start', async (req, res) => {
    
    const { trackUri } = req.body; // Optional: Specific track URI
    try {
        if (trackUri) {
            // Start specific track
            await spotifyApi.play({ uris: [trackUri] });
        } else {
            // Resume playback
            await spotifyApi.play();
        }
        res.status(200).json({ message: 'Playback started or resumed' });
    } catch (error) {
        console.error('Error starting/resuming playback:', error.message);
        res.status(500).json({ error: 'Failed to start or resume playback', details: error.message });
    }
});

// Pause playback
router.post('/player/pause', async (req, res) => {
    try {
        await spotifyApi.pause();
        res.status(200).json({ message: 'Playback paused' });
    } catch (error) {
        console.error('Error pausing playback:', error.message);
        res.status(500).json({ error: 'Failed to pause playback', details: error.message });
    }
});

// Seek to a position in the track
router.post('/player/seek', async (req, res) => {
    const { positionMs } = req.body; // Position in milliseconds

    if (typeof positionMs !== 'number') {
        return res.status(400).json({ error: 'positionMs must be a number' });
    }

    try {
        await spotifyApi.seek(positionMs);
        res.status(200).json({ message: 'Seeked to position' });
    } catch (error) {
        console.error('Error seeking track position:', error.message);
        res.status(500).json({ error: 'Failed to seek track', details: error.message });
    }
});

// Change volume
router.post('/player/volume', async (req, res) => {
    const { volumePercent } = req.body; // Volume percentage (0-100)

    if (typeof volumePercent !== 'number' || volumePercent < 0 || volumePercent > 100) {
        return res.status(400).json({ error: 'volumePercent must be a number between 0 and 100' });
    }

    try {
        await spotifyApi.setVolume(volumePercent);
        res.status(200).json({ message: 'Volume changed' });
    } catch (error) {
        console.error('Error changing volume:', error.message);
        res.status(500).json({ error: 'Failed to change volume', details: error.message });
    }
});

export default router;
