import "../styles/SongCard.css"

function SongCard({name, albumCover, artist, year, onSelect, isSelected}){

    const songStyle ={
        backgroundColor: isSelected ? 'rgb(87, 124, 87)' : 'rgb(97, 97, 97)',
        border: isSelected ? '2px solid green' : '1px solid gray',
        color: 'white'
    }

    return(
        <div className="card" style={songStyle} onClick={onSelect}>
            <img src={albumCover} alt="image not found" className="album-picture" />
            <h3>{name + " (" + year + ")"} </h3>
            <i>{artist}</i>
        </div>
    );
}

export default SongCard;