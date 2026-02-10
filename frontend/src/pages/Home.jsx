import { useState, useEffect } from "react";
import api from "../api";
import { Button, Card } from "antd";

function Home() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    getTracks();
    getPlaylist();
  }, []);

  const getTracks = async () => {
    const res = await api.get("/api/tracks/");
    setTracks(res.data);
  };

  const getPlaylist = async () => {
    const res = await api.get("/api/playlist/");
    setPlaylist(res.data);
  };

  const addTracksToPlaylist = async (trackId) => {
    const res = await api.post("/api/playlist/add/", { track_id: trackId });
    await getPlaylist();
  };

  const isInPlaylist = (trackId) =>
    playlist.some((item) => item.track.id === trackId);

  const deleteFromPlaylist = async (playlistTrackId) => {
    await api.delete(`/api/playlist/delete/${playlistTrackId}/`);
    await getPlaylist();
  };

  const upvotePlaylistTrack = async (playlistTrackId) => {
    await api.put(`/api/playlist/upvote/${playlistTrackId}/`);
    await getPlaylist();
    console.log(playlist);
  };

  const downvotePlaylistTrack = async (playlistTrackId) => {
    await api.put(`/api/playlist/downvote/${playlistTrackId}/`);
    await getPlaylist();
  };

  return (
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

      {/* Right side - Playlist */}
      <div style={{ flex: 1 }}>
        <h2>Playlist</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {playlist.map((item) => (
            <Card key={item.id} title={item.track.title} style={{ width: 280 }}>
              <p>Artist: {item.track.artist}</p>
              <p>Album: {item.track.album}</p>
              <p>Duration: {item.track.duration_seconds}s</p>
              <p>Genre: {item.track.genre}</p>
              <p>Added by: {item.user_username}</p>
              <p>Votes: {item.votes}</p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <Button
                  type="primary"
                  style={{ flex: 1 }}
                  onClick={() => upvotePlaylistTrack(item.id)}
                >
                  Upvote
                </Button>
                <Button
                  type="primary"
                  style={{ flex: 1 }}
                  onClick={() => downvotePlaylistTrack(item.id)}
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
