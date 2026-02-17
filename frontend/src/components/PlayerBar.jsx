import usePlayerStore from "../store";

function PlayerBar() {
  const { currentTrack, isPlaying } = usePlayerStore();

  if (!currentTrack) return null;

  return (
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
  );
}

export default PlayerBar;
