import { useState, useEffect } from "react";
import api from "../api";
import { Button, Card } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePlayerStore from "../store";

function Home() {
  // const [username, setUsername] = useState(null);
  // const [tracks, setTracks] = useState([]);
  // const [playlist, setPlaylist] = useState([]);
  // const [history, setHistory] = useState([]);

  const queryClient = useQueryClient();

  // const [currentTrack, setCurrentTrack] = useState(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [activeTab, setActiveTab] = useState("playlist");
  // const [searchQuery, setSearchQuery] = useState("");

  const { currentTrack, isPlaying, play, pause, activeTab,setActiveTab, searchQuery, setSearchQuery } = usePlayerStore();

  // useEffect(() => {
  //   getTracks();
  //   getPlaylist();
  //   getUsername();
  //   getHistory();
  // }, []);

  /* 
    /api/tracks/, /api/playlist/, /api/history/ -> all return arrays. We store the array in state and then .map() over it

    /api/user/me/ -> returns a single object
  */
 
  // const getTracks = async () => {
  //   const res = await api.get("/api/tracks/");
  //   setTracks(res.data);
  // };

  // const getPlaylist = async () => {
  //   const res = await api.get("/api/playlist/");
  //   setPlaylist(res.data);
  // };

  // const getUsername = async () => {
  //   const res = await api.get("/api/user/me/");
  //   setUsername(res.data.username);
  // };

  // const getHistory = async () => {
  //   const res = await api.get("/api/history/");
  //   setHistory(res.data);
  // };

  //using react query
  const { data: tracks = [], isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => api.get("/api/tracks/").then((res) => res.data),
  });

  const { data: playlist = [], isLoading: playlistLoading } = useQuery({
    queryKey: ["playlist"],
    queryFn: () => api.get("/api/playlist/").then((res) => res.data),
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ["history"],
    queryFn: () => api.get("/api/history/").then((res) => res.data),
  });

  const { data: username, isLoading: usernameLoading } = useQuery({
    queryKey: ["username"],
    queryFn: () => api.get("/api/user/me/").then((res) => res.data.username),
  });

  const addToPlaylistMutation = useMutation({
    mutationFn: (trackId) =>
      api.post("/api/playlist/", {
        track_id: trackId,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["playlist"] }),
  });

  const isInPlaylist = (trackId) =>
    playlist.some((item) => item.track.id === trackId);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/playlist/delete/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["playlist"] }),
  });

  const upvoteMutation = useMutation({
    mutationFn: ({ id, userId }) =>
      api.put(`/api/playlist/upvote/${id}/`, { user_id: userId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["playlist"],
      }),
  });

  const downvoteMutation = useMutation({
    mutationFn: ({ id, userId }) =>
      api.put(`/api/playlist/downvote/${id}/`, { user_id: userId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["playlist"],
      }),
  });

  const historyMutation = useMutation({
    mutationFn: (playlistTrackId) =>
      api.post("/api/history/", { playlist_track_id: playlistTrackId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["history"],
      }),
  });

  // const addTracksToPlaylist = async (trackId) => {
  //   const res = await api.post("/api/playlist/", { track_id: trackId });
  //   await getPlaylist();
  // };

  // const deleteFromPlaylist = async (playlistTrackId) => {
  //   await api.delete(`/api/playlist/delete/${playlistTrackId}/`);
  //   await getPlaylist();
  // };

  // const addTracksToHistory = async (playlistTrackId) => {
  //   await api.post("/api/history/", {
  //     playlist_track_id: playlistTrackId,
  //   });
  //   await getHistory();
  // };

  // const upvotePlaylistTrack = async (playlistTrackId, userId) => {
  //   await api.put(`/api/playlist/upvote/${playlistTrackId}/`, {
  //     user_id: userId,
  //   });
  //   await getPlaylist();
  //   console.log(playlist);
  // };

  // const downvotePlaylistTrack = async (playlistTrackId, userId) => {
  //   await api.put(`/api/playlist/downvote/${playlistTrackId}/`, {
  //     user_id: userId,
  //   });
  //   await getPlaylist();
  // };

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          <input
            type="text"
            placeholder="Search by title, artist, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              marginBottom: "16px",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
              fontSize: "14px",
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {filteredTracks.map((track) => (
              <Card key={track.id} title={track.title} style={{ width: 280 }}>
                <p>Artist: {track.artist}</p>
                <p>Album: {track.album}</p>
                <p>Duration: {track.duration_seconds}s</p>
                <p>Genre: {track.genre}</p>
                <Button
                  type="primary"
                  onClick={() => addToPlaylistMutation.mutate(track.id)}
                  disabled={isInPlaylist(track.id)}
                >
                  Add to Playlist
                </Button>
              </Card>
            ))}
            {filteredTracks.length === 0 && <p>No tracks found.</p>}
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
                      onClick={() =>
                        upvoteMutation.mutate({
                          id: item.id,
                          userId: item.user.id,
                        })
                      }
                      disabled={item.has_voted}
                    >
                      Upvote
                    </Button>
                    <Button
                      type="primary"
                      style={{ flex: 1 }}
                      onClick={() =>
                        downvoteMutation.mutate({
                          id: item.id,
                          userId: item.user.id,
                        })
                      }
                      disabled={item.has_voted}
                    >
                      Downvote
                    </Button>
                  </div>
                  <Button
                    type="primary"
                    danger
                    onClick={() => deleteMutation.mutate(item.id)}
                    style={{ width: "100%" }}
                  >
                    Delete
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: "100%", marginTop: "8px" }}
                    onClick={() => {
                      // setCurrentTrack(item.track);
                      // setIsPlaying(true);
                      play(item.track);
                      historyMutation.mutate(item.id);
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
