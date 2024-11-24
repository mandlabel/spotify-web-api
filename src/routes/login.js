import express from 'express';
import querystring from 'querystring';

const router = express.Router();

router.get('/login', (req, res) => {
    // Retrieve the Spotify client ID and redirect URI from environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    // Define the permissions (scopes) required for the Spotify API
    const scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-private',
        'user-read-email',
        'playlist-modify-private',
        'playlist-modify-public',
        'user-library-read',
        'user-library-modify',
        'user-read-playback-position',
        'user-top-read',
        'user-read-recently-played'
    ];

    // Generate a random state string to prevent cross-site request forgery (CSRF)
    const state = Math.random().toString(36).substring(7);

    // Ensure that the necessary environment variables are provided
    if (!clientId || !redirectUri) {
        throw new Error('Missing required environment variables'); // Throw error if variables are missing
    }

    // Construct the Spotify authorization URL with the specified parameters
    const authUrl = `${process.env.SPOTIFY_API_BASE_URL}/authorize?${querystring.stringify({
        response_type: 'code',        // Request an authorization code as the response type
        client_id: clientId,          // Include the client ID in the request
        scope: scopes.join(' '),      // Join the scopes array into a space-separated string
        redirect_uri: redirectUri,    // Specify the redirect URI after successful authorization
        state: state,                 // Include the generated state for security
    })}`;

    res.redirect(authUrl);
});

export default router;
