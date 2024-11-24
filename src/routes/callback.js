import express from 'express';
import querystring from 'querystring';
import axios from 'axios';
import { setAccessToken } from '../utils/tokenmanager.js';
import fs from 'fs';

const router = express.Router();

router.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
    }

    try {
        const response = await axios.post(
            `${process.env.SPOTIFY_API_BASE_URL}/api/token`,
            querystring.stringify({
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        

        const { access_token } = response.data;
        setAccessToken(access_token);

        // Write the access token to a text file
        fs.writeFile('access_token.txt', access_token, (err) => {
            if (err) {
                console.error('Error writing access token to file:', err);
            } else {
                console.log('Access token saved to access_token.txt');
            }
        });

        res.redirect('/profile');
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

export default router;
