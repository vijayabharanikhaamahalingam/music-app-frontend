import React from "react";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

const LibrarySong = ({
  song,
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  id,
  isPlayListSelected,
  deletePlaylist,
  handleSongChange,
  setIsPlaying
}) => {
  const songSelectHandler = async () => {
    await setCurrentSong(song);
    //active
    const newSongs = songs.map((song) => {
      if (song.id === id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
    handleSongChange(song.name)
    setIsPlaying(true)
    //check if song is playing
    if (isPlaying) audioRef.current.play();
  };

  const handleDeleteFromPlaylist =(event)=>{
    deletePlaylist(song.name)
  }

  return (
    <div
      onClick={songSelectHandler}
      className={`library-song ${song.active ? "selected" : ""}`}
    >
      <img src={song.cover} alt={song.name} />
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
        {isPlayListSelected && 
        <IconButton aria-label="Example" onClick={handleDeleteFromPlaylist}>
        <FontAwesomeIcon title="Delete from Playlist" icon={faTrash} />
      </IconButton>
        }
      </div>
    </div>
  );
};

export default LibrarySong;
