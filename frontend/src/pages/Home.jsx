import {useState, useEffect} from "react"
import api from "../api"
import Note from "../components/Note"
import SongCard from "../components/SongCard"
import Slider from "../components/Slider"
import "../styles/Home.css"
import {Buffer} from 'buffer'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import {CLIENT_ID, CLIENT_SECRET} from "../spotifyKeys"

class Song {
    constructor(id, name, albumCover, artist, year) {
        this.id = id;
        this.name = name;
        this.albumCover = albumCover;
        this.artist = artist;
        this.year = year;
      }
}

function Home() {

    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [spotifyToken, setSpotifyToken] = useState("");
    const [songSearch, setSongSearch] = useState("");
    const [songName, setSongName] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [albumPic, setAlbumPic] = useState("");
    const [songId, setSongId] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    //spotify access token retrieval
    const requestAuthorization = async () => {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials'
          };

        const response = await axios(authOptions);
        const token = response.data.access_token;
        setSpotifyToken(token);
        console.log('Access Token:', spotifyToken.toString());
    }

    const searchSong = (e) => {
        e.preventDefault();

        const url = `https://api.spotify.com/v1/search?q=${songSearch}&type=track&market=US&limit=5`

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + spotifyToken,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log(data.tracks.items);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].album.release_date);
            console.log(data.tracks.items[0].album.images[2].url);
            const songs = [
                new Song(data.tracks.items[0].id, data.tracks.items[0].name, data.tracks.items[0].album.images[2].url, data.tracks.items[0].artists[0].name, data.tracks.items[0].album.release_date),
                new Song(data.tracks.items[1].id, data.tracks.items[1].name, data.tracks.items[1].album.images[2].url, data.tracks.items[1].artists[0].name, data.tracks.items[1].album.release_date),
                new Song(data.tracks.items[2].id, data.tracks.items[2].name, data.tracks.items[2].album.images[2].url, data.tracks.items[2].artists[0].name, data.tracks.items[2].album.release_date),
                new Song(data.tracks.items[3].id, data.tracks.items[3].name, data.tracks.items[3].album.images[2].url, data.tracks.items[3].artists[0].name, data.tracks.items[3].album.release_date),
            ];
            setSearchResults(songs);
        })

    }


    useEffect(() => {
        requestAuthorization();
        getNotes();
    }, [])

    const getNotes = () => {
        api
        .get("/api/notes/")
        .then((res) => res.data)
        .then((data) => { setNotes(data); console.log(data) } )
        .catch((err) => alert(err));
    }

    const deleteNote = (id) => {
        api
        .delete(`/api/notes/delete/${id}/`)
        .then((res) => {
            if(res.status === 204) alert("Note Deleted")
            else alert("Failed to delete Note")
            getNotes();
        })
        .catch((error) => alert(error));
    }

    const editNote = (id) => {
        const updatedNote = {rating: 69, content: "plz work"};
        
        api
        .patch(`/api/notes/update/${id}/`, updatedNote)
        .then((res) => {
            console.log(res);
            if(res.status === 200) alert("Note Edited")
            else alert("Failed to edit Note")
            getNotes();
        })
        .catch((error) => alert(error));

    }

    const createNote = (e) => {
        e.preventDefault()
        api
        .post("/api/notes/", {content, songName, artist, year, albumPic, rating})
        .then((res) => {
            if(res.status === 201) alert("Note Created")
            else alert("Failed to make note: Please fill in the entire form")
            getNotes();
        })
        .catch((err) => alert(err));
    }

    const handleSliderChange = (newValue) => {
        // Update the state variable in the home page component
        setRating(newValue);
    };

    const logout = () => {
        navigate('/logout');
    }

    return (
    
        <div class="big-grid">
            <div class="header-grid-item">
                <h1>TUNE CRITIQUE</h1>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
            <div class="review-grid-item">
                <h2 className="review-title">My Reviews:</h2>
                <div class="notes">
                    {notes.map((note) => <Note note={note} onDelete={deleteNote} onEdit={editNote} key={note.id}></Note>)}
                </div>
            </div>
            <div className="form-grid-item">
                <div class = "grid-container">
                    <form className="right-grid" onSubmit={createNote}>

                        <label htmlFor="content">Share your opinion:</label>
                        <br/>
                        <textarea id ="content" name = "content" required value = {content} onChange={(e) => setContent(e.target.value)}></textarea>
                        <br/>
                        <label htmlFor="rating-slider">Rating:</label>
                        <br/>
                        <Slider id="rating-slider" onSliderChange={handleSliderChange}></Slider>
                        <br/>
                        <input className="submit-button" type = "submit" value = "Submit"></input>
                    </form>
                    <form className="left-grid" onSubmit={searchSong}>
                        <div className="search-container">
                            <input type="text" className="search-bar" placeholder="Search Songs" id="song_search" required onChange={(e) => setSongSearch(e.target.value)} value={songSearch}></input>
                            <input type="submit" className="submit-search"value="search"></input>
                        </div>
                        <br />
                        <div class="results-container">
                            {searchResults.length === 0 ? <h4 className="no-results">No Results</h4> : searchResults.map((song) => (
                                <SongCard
                                    key={song.id}
                                    name={song.name}
                                    albumCover={song.albumCover}
                                    artist={song.artist}
                                    year={song.year.substring(0,4)}
                                    onSelect={() =>{
                                        setSongName(song.name);
                                        setArtist(song.artist);
                                        setAlbumPic(song.albumCover);
                                        setYear(song.year.substring(0,4));
                                        setSongId(song.id);
                                    }}
                                    isSelected={song.id === songId}
                                />
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        
        </div>
    );
}

export default Home