import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi();

export const setAccessToken = (token) => {
    console.log("new token: " + token)
    spotifyApi.setAccessToken(token);
};

export const getSpotifyApi = () => {
    return spotifyApi;
};
