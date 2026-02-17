import { Button, Card } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePlayerStore from "../store";
import api from "../api";

function PlaylistPanel() {
  const queryClient = useQueryClient();
  const { currentTrack, isPlaying, play, activeTab, setActiveTab } =
    usePlayerStore();

  const { data: playlist = [] } = useQuery({
    queryKey: ["playlist"],
    queryFn: () => api.get("/api/playlist/").then((res) => res.data),
  });

  const { data: history = [] } = useQuery({
    queryKey: ["history"],
    queryFn: () => api.get("/api/history/").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/playlist/delete/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playlist"] }),
  });

  const upvoteMutation = useMutation({
    mutationFn: ({ id, userId }) =>
      api.put(`/api/playlist/upvote/${id}/`, { user_id: userId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playlist"] }),
  });

  const downvoteMutation = useMutation({
    mutationFn: ({ id, userId }) =>
      api.put(`/api/playlist/downvote/${id}/`, { user_id: userId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playlist"] }),
  });

  const historyMutation = useMutation({
    mutationFn: (playlistTrackId) =>
      api.post("/api/history/", { playlist_track_id: playlistTrackId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["history"] }),
  });

  return (
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
  );
}

export default PlaylistPanel;
