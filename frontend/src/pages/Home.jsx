import {useState, useEffect} from 'react'
import api from '../api';
import { Button } from 'antd';

function Home(){
    const [tracks, setTracks] = useState([])
    const [playlist, setPlaylist] = useState([])

    useEffect(() => {
        getTracks();
        getPlaylist();
    }, [])

    //api.get('/api/tracks/')
    // const getTracks = async () => {
    //     api.get('/api/tracks/').then((res) => res.data).then((data) => {
    //         setTracks(data);
    //         console.log(data)
    //     })
    // }

    const getTracks = async () => {
        const res = await api.get('/api/tracks/');
        setTracks(res.data);
        console.log(res.data)
    }

    //api.get('/api/playlist/')
    const getPlaylist = async () => {
        const res = await api.get('/api/playlist/');
        setPlaylist(res.data);
        console.log(playlist)
    }

    const addTracksToPlaylist = async (trackId) => {
        const res = await api.post('/api/playlist/add/', {track_id: trackId});
        //console.log(res.data);
        //setPlaylist(res.data);
        await getPlaylist();
        //setPlaylist(res.data);
    }

    return (
        <div>
            <div>
           {tracks.map(
            (track) => (
                <div key={track.id}>
                    <div>{track.title}</div>
                    <div>{track.artist}</div>
                    <div>{track.album}</div>
                    <div>{track.duration_seconds}</div>
                    <div>{track.genre}</div>
                    <div>{track.cover_url}</div>
                    <button onClick={() => addTracksToPlaylist(track.id)}>Add</button>
                </div>
            )
           )}
           </div>
           <div>
            {playlist.map(
            (playlist) => (
                <div key={playlist.id}>
                    <div>{playlist.track.title}</div>
                    <div>{playlist.track.artist}</div>
                    <div>{playlist.track.album}</div>
                    <div>{playlist.track.duration_seconds}</div>
                    <div>{playlist.track.genre}</div>
                    <div>{playlist.track.cover_url}</div>
                    <br />
                </div>
            )
           )} 
           </div>

        </div>

    )

}

export default Home