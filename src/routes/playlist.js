import express from 'express';
import { getSpotifyApi } from '../utils/tokenmanager.js';

const router = express.Router();
const spotifyApi = getSpotifyApi();

// Get user's playlists
router.get('/playlists', async (req, res) => {
    try {
        const playlists = await spotifyApi.getUserPlaylists();
        res.status(200).json({ message: 'Owned Playlists fetched successfully', playlists: playlists.body.items });
    } catch (error) {
        console.error('Error fetching user playlists:', error.message);
        res.status(500).json({ error: 'Failed to fetch playlists', details: error.message });
    
    }
});

// Get Playlist
router.get('/playlist/:id/tracks', async (req, res) => {
    const { id } = req.params; // Playlist ID

    try {
        const response = await spotifyApi.getPlaylistTracks(id);
        const tracks = response.body.items.map((item) => ({
            trackName: item.track.name,
            artists: item.track.artists.map((artist) => artist.name).join(', '),
            album: item.track.album.name,
            durationMs: item.track.duration_ms,
        }));

        res.status(200).json({ playlistId: id, tracks });
    } catch (error) {
        console.error('Error fetching playlist tracks:', error.message);
        res.status(500).json({ error: 'Failed to fetch playlist tracks', details: error.message });
    }
});

// Create Playlist
router.post('/playlist', async (req, res) => {
    const { name, description, public: isPublic } = req.body;

    try {
        const response = await spotifyApi.createPlaylist(name, {
            description,
            public: isPublic,
        });
        res.status(201).json({ message: 'Playlist created', playlist: response.body });
    } catch (error) {
        console.error('Error creating playlist:', error.message);
        res.status(500).json({ error: 'Failed to create playlist', details: error.message });
    }
});

// Edit Playlist Details
router.put('/playlist/:id', async (req, res) => {
    const { id } = req.params;

    console.log("id: " + id)
    const { name, description, public: isPublic } = req.body;

    if (!name && !description && typeof isPublic === 'undefined') {
        return res.status(400).json({ error: 'At least one field (name, description, public) must be provided' });
    }

    try {
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (typeof isPublic !== 'undefined') updateData.public = isPublic;

        await spotifyApi.changePlaylistDetails(id, updateData);
        res.status(200).json({ message: 'Playlist details updated successfully' });
    } catch (error) {
        console.error(`Error updating playlist details: `, error.message);
        res.status(500).json({ error: 'Failed to update playlist details', details: error.message });
    }
});

// Add Tracks To Playlist
router.post('/playlist/:id/tracks', async (req, res) => {
    const { id } = req.params;
    const { trackUris } = req.body;

    try {
        await spotifyApi.addTracksToPlaylist(id, trackUris);
        res.status(200).json({ message: 'Tracks added to playlist' });
    } catch (error) {
        console.error('Error adding tracks to playlist:', error.message);
        res.status(500).json({ error: 'Failed to add tracks to playlist', details: error.message });
    }
});

// Remove Tracks from Playlist
router.delete('/playlist/:id/tracks', async (req, res) => {
    const { id } = req.params;
    const { trackUris } = req.body;

    try {
        await spotifyApi.removeTracksFromPlaylist(id, trackUris.map((uri) => ({ uri })));
        res.status(200).json({ message: 'Tracks removed from playlist' });
    } catch (error) {
        console.error('Error removing tracks from playlist:', error.message);
        res.status(500).json({ error: 'Failed to remove tracks from playlist', details: error.message });
    }
});

export default router;
