import React from "react"
import "../styles/Note.css"
import {useState} from 'react'

function Note({note, onDelete, onEdit}) {

    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")
    const [isPopUpVisible, setPopUpVisible] = useState(false);

    const togglePopUp = () => {
        setPopUpVisible(!isPopUpVisible);
    }

    return <div className = "note-container">
        <img src={note.albumPic} alt="album cover not found" className="album-cover"></img>
        <h3 className="note-title">{note.songName + " (" + note.year + ")"}</h3>
        <i>{note.artist}</i>
        <p className="note-content">{note.content}</p>
        <h4 className="review-rating">{note.rating}%</h4>
        <p className="note-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => onDelete(note.id)}>Delete</button>
        <button className="edit-button" onClick={() => onEdit(note.id)}>Edit</button>
    </div>
}

export default Note;