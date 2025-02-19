import { useState } from "react";
import axios from "axios";

export default function App() {
  const [word, setWord] = useState("");
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!word.trim()) {
      setError("Please enter a word.");
      return;
    }

    setError(null); // Reset error if word is provided

    try {
      const response = await axios.post("http://localhost:3000/generate-song", {
        mood: word, // Word is used here as the "mood"
      });
      setSong(response.data.song);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch song. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Logo text */}
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-black mb-12">
        Wordify
      </h1>

      {/* Word input */}
      <div className="w-full max-w-md mt-6">
        <input
          type="text"
          placeholder="Enter a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full p-4 text-lg border rounded-full shadow-md focus:outline-none"
        />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
      >
        Get Random Song
      </button>

      {/* Display error message */}
      {error && <div className="mt-4 text-red-500">{error}</div>}

      {/* Display song result */}
      {song && (
        <div className="mt-6 w-full max-w-md p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Song Suggestion:</h2>
          <p className="mt-2">
            <strong>Title:</strong> {song.title}
          </p>
          <p>
            <strong>Artist:</strong> {song.artist}
          </p>
          <p>
            <strong>Album:</strong> {song.album}
          </p>
          {song.preview_url !== "Preview not available" ? (
            <audio controls>
              <source src={song.preview_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>No preview available</p>
          )}
        </div>
      )}
    </div>
  );
}
