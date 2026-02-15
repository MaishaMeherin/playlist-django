import { useState, useEffect } from "react";
import api from "../api";
import { Button, Card } from "antd";

function Home() {
  const [username, setUsername] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("playlist");

  useEffect(() => {
    getTracks();
    getPlaylist();
    getUsername();
    getHistory();
  }, []);

  const getTracks = async () => {
    const res = await api.get("/api/tracks/");
    setTracks(res.data);
  };

  const getPlaylist = async () => {
    const res = await api.get("/api/playlist/");
    setPlaylist(res.data);
  };

  const getUsername = async () => {
    const res = await api.get("/api/user/me/");
    setUsername(res.data.username);
  };

  const getHistory = async () => {
    const res = await api.get("/api/history/");
    setHistory(res.data);
  };

  const addTracksToPlaylist = async (trackId) => {
    const res = await api.post("/api/playlist/", { track_id: trackId });
    await getPlaylist();
  };

  const isInPlaylist = (trackId) =>
    playlist.some((item) => item.track.id === trackId);

  const deleteFromPlaylist = async (playlistTrackId) => {
    await api.delete(`/api/playlist/delete/${playlistTrackId}/`);
    await getPlaylist();
  };

  const addTracksToHistory = async (playlistTrackId) => {
    await api.post("/api/history/", {
      playlist_track_id: playlistTrackId,
    });
    await getHistory();
  };

  const upvotePlaylistTrack = async (playlistTrackId, userId) => {
    await api.put(`/api/playlist/upvote/${playlistTrackId}/`, {
      user_id: userId,
    });
    await getPlaylist();
    console.log(playlist);
  };

  // const isAlreadyUpvoted = (userId) => {
  //   playlist.some((item) => item.user.id === userId);
  // }

  const downvotePlaylistTrack = async (playlistTrackId, userId) => {
    await api.put(`/api/playlist/downvote/${playlistTrackId}/`, {
      user_id: userId,
    });
    await getPlaylist();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "white",
          color: "gray",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Welcome, {username}
        </span>
        <Button
          danger
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>
      </div>
      {currentTrack && (
        <div
          style={{
            padding: "12px 24px",
            background: "#1a1a1a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span>
            {currentTrack.title} - {currentTrack.artist}
          </span>
          <audio
            src={currentTrack.audio_url}
            controls
            autoPlay
            style={{ flex: 1 }}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: "24px", padding: "24px" }}>
        {/* Left side - Track Library */}
        <div style={{ flex: 1 }}>
          <h2>Track Library</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {tracks.map((track) => (
              <Card key={track.id} title={track.title} style={{ width: 280 }}>
                <p>Artist: {track.artist}</p>
                <p>Album: {track.album}</p>
                <p>Duration: {track.duration_seconds}s</p>
                <p>Genre: {track.genre}</p>
                <Button
                  type="primary"
                  onClick={() => addTracksToPlaylist(track.id)}
                  disabled={isInPlaylist(track.id)}
                >
                  Add to Playlist
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side - Playlist / History */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Button
              type={activeTab === "playlist" ? "primary" : "default"}
              onClick={() => setActiveTab("playlist")}
            >
              Playlist
            </Button>
            <Button
              type={activeTab === "history" ? "primary" : "default"}
              onClick={() => setActiveTab("history")}
            >
              History
            </Button>
          </div>

          {activeTab === "playlist" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {playlist.map((item) => (
                <Card
                  key={item.id}
                  title={item.track.title}
                  style={{ width: 280 }}
                >
                  <p>Artist: {item.track.artist}</p>
                  <p>Album: {item.track.album}</p>
                  <p>Duration: {item.track.duration_seconds}s</p>
                  <p>Genre: {item.track.genre}</p>
                  <p>Added by: {item.user_username}</p>
                  <p>Votes: {item.votes}</p>
                  <div
                    style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                  >
                    <Button
                      type="primary"
                      style={{ flex: 1 }}
                      onClick={() => upvotePlaylistTrack(item.id, item.user.id)}
                      disabled={item.has_voted}
                    >
                      Upvote
                    </Button>
                    <Button
                      type="primary"
                      style={{ flex: 1 }}
                      onClick={() =>
                        downvotePlaylistTrack(item.id, item.user.id)
                      }
                      disabled={item.has_voted}
                    >
                      Downvote
                    </Button>
                  </div>
                  <Button
                    type="primary"
                    danger
                    onClick={() => deleteFromPlaylist(item.id)}
                    style={{ width: "100%" }}
                  >
                    Delete
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: "100%", marginTop: "8px" }}
                    onClick={() => {
                      setCurrentTrack(item.track);
                      setIsPlaying(true);
                      addTracksToHistory(item.id);
                    }}
                  >
                    {currentTrack?.id === item.track.id && isPlaying
                      ? "Playing"
                      : "Play"}
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {history.map((item) => (
                <Card
                  key={item.id}
                  title={`${item.playlist_track.track.title}`}
                  style={{ width: 280 }}
                >
                  <p>Artist: {item.playlist_track.track.artist}</p>
                  <p>Album: {item.playlist_track.track.album}</p>
                  <p>Duration: {item.playlist_track.track.duration_seconds}s</p>
                  <p>Genre: {item.playlist_track.track.genre}</p>
                  <p>Played at: {new Date(item.played_at).toLocaleString()}</p>
                </Card>
              ))}
              {history.length === 0 && <p>No history yet. Play a track!</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
