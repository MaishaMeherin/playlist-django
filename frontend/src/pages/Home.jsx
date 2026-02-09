import { useState, useEffect } from "react";
import api from "../api";
import { Button } from "antd";
import { Card, Space } from "antd";

function Home() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    getTracks();
    getPlaylist();
  }, []);

  //api.get('/api/tracks/')
  // const getTracks = async () => {
  //     api.get('/api/tracks/').then((res) => res.data).then((data) => {
  //         setTracks(data);
  //         console.log(data)
  //     })
  // }

  const getTracks = async () => {
    const res = await api.get("/api/tracks/");
    setTracks(res.data);
    console.log(res.data);
  };

  //api.get('/api/playlist/')
  const getPlaylist = async () => {
    const res = await api.get("/api/playlist/");
    setPlaylist(res.data);
    console.log(playlist);
  };

  const addTracksToPlaylist = async (trackId) => {
    const res = await api.post("/api/playlist/add/", { track_id: trackId });
    //console.log(res.data);
    //setPlaylist(res.data);
    await getPlaylist();
    //setPlaylist(res.data);
  };

  return (
    <div>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {tracks.map((track) => (
            <div key={track.id}>
              <Card
                title={`Song name: ${track.title}`}
                extra={<a href="#">More</a>}
                style={{ width: 300 }}
              >
                <div>{track.title}</div>
                <div>{track.artist}</div>
                <div>{track.album}</div>
                <div>{track.duration_seconds}</div>
                <div>{track.genre}</div>
                <div>{track.cover_url}</div>
                <button onClick={() => addTracksToPlaylist(track.id)}>
                  Add
                </button>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {playlist.map((item) => (
            <div key={item.id}>
              <Card
                title={`Song name: ${item.track.title}`}
                extra={<a href="#">More</a>}
                style={{ width: 300 }}
              >
                <div>{item.track.artist}</div>
                <div>{item.track.album}</div>
                <div>{item.track.duration_seconds}</div>
                <div>{item.track.genre}</div>
                <div>{item.track.cover_url}</div>
                <div>Added by: {item.user_username}</div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
