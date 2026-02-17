import Navbar from "../components/Navbar";
import PlayerBar from "../components/PlayerBar";
import TrackLibrary from "../components/TrackLibrary";
import PlaylistPanel from "../components/PlaylistPanel";

function Home() {
  return (
    <>
      <Navbar />
      <PlayerBar />
      <div style={{ display: "flex", gap: "24px", padding: "24px" }}>
        <TrackLibrary />
        <PlaylistPanel />
      </div>
    </>
  );
}

export default Home;
