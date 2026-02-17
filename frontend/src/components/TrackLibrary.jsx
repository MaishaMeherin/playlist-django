import { Button, Card } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePlayerStore from "../store";
import api from "../api";

function TrackLibrary() {
  const queryClient = useQueryClient();
  const { searchQuery, setSearchQuery } = usePlayerStore();

  const { data: tracks = [] } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => api.get("/api/tracks/").then((res) => res.data),
  });

  const { data: playlist = [] } = useQuery({
    queryKey: ["playlist"],
    queryFn: () => api.get("/api/playlist/").then((res) => res.data),
  });

  const addToPlaylistMutation = useMutation({
    mutationFn: (trackId) =>
      api.post("/api/playlist/", { track_id: trackId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playlist"] }),
  });

  const isInPlaylist = (trackId) =>
    playlist.some((item) => item.track.id === trackId);

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
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
  );
}

export default TrackLibrary;
