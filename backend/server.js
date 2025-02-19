import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Get an access token from Spotify
async function getSpotifyToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body["access_token"]);
}

// API route to fetch a random song based on mood
app.post("/generate-song", async (req, res) => {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }
  
    try {
      console.log("Searching for songs with mood:", mood);
      await getSpotifyToken();
  
      // URL-encode the mood to ensure proper query format
      const encodedMood = encodeURIComponent(mood);
  
      // Search Spotify for up to 50 tracks based on the mood
      const response = await spotifyApi.searchTracks(encodedMood, { limit: 50 });
      console.log("Spotify response:", response.body);
  
      if (!response.body.tracks || response.body.tracks.items.length === 0) {
        return res.status(404).json({ error: `No songs found for mood "${mood}"` });
      }
  
      // Select a truly random track from the list
      const randomIndex = Math.floor(Math.random() * response.body.tracks.items.length);
      const randomTrack = response.body.tracks.items[randomIndex];
  
      const song = {
        title: randomTrack.name,
        artist: randomTrack.artists[0].name,
        album: randomTrack.album.name,
        preview_url: randomTrack.preview_url || "Preview not available",
      };
  
      res.json({ song });
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ error: "Failed to fetch song" });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
