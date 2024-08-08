import React, { useEffect, useState } from "react";
import LibrarySong from "./LibrarySong";
import { Box, FormControl, InputLabel, MenuItem, Select, Snackbar } from "@mui/material";
import userServices from "../services/userServices";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  }
}
const Library = ({
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  setLibraryStatus,
  libraryStatus,
  playList,
  handlePlayListChange,
  isPlayListSelected,
  deletePlayList
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPlaylist, setSelectedPlaylist] = useState("All");

  const search_parameters = Object.keys(Object.assign({}, ...songs));

  const [user, setUser] = useState({})

  const [snackBarMessage, setSnackBarMessage] = useState("")

  const [snackbarOpen, setSnackbarOpen] = useState(false);



  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(()=>{
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
     
  },[])

  const search = (songs) => {
    return songs.filter((data) =>

      search_parameters.some((parameter) =>

        data['name'].toString().toLowerCase().includes(searchQuery.toLowerCase()) || data['artist'].toString().toLowerCase().includes(searchQuery.toLowerCase())

      )

    );
  }

  const handleChange = (event) => {
    setSelectedPlaylist(event.target.value)
    handlePlayListChange(playList,event.target.value)    
    }

  const deletePlaylist = async(songName) =>{
    userServices.deletePlaylist(songName, selectedPlaylist, user.email).then(response =>{
      deletePlayList() 
      setSnackbarOpen(true);
      setSnackBarMessage("Song deleted from "+selectedPlaylist)
      const playListVal = []
      playListVal.push(response.data.playList)
      handlePlayListChange(playListVal,selectedPlaylist)
    })
  
  }


  return (
    <div className={`library ${libraryStatus ? "active" : ""}`}>
      
        <h2 style={{float:"left"}}>Library</h2>
        <div style={{position:"relative",left:"1em"}} className="mt-4">
        <FormControl style={{minWidth: 120}}>       
        <Box sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Playlist</InputLabel>
        <Select
          labelId="demo-simple-select-label" sx={{ minWidth: 130 }}
          id="demo-simple-select"
          value={selectedPlaylist}
          label="Playlist"
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {playList &&
          playList.map((list) => (
              <MenuItem
              key={list._id}
              value={list.playList}
            >
              {list.playList}
            </MenuItem>
            
          ))
        }
        </Select>
        </Box>
        </FormControl>
        </div>
      <div className="input-box">

         <input

             type="search"

             name="search-form"

             id="search-form"

             className="search-input ms-4 mb-4"

              onChange={(e) => {setSearchQuery(e.target.value);
              }
              }

             placeholder="Search Song, Artist.."

         />

       </div>
      <div className="library-songs">
        {search(songs).map((song) => (
          <LibrarySong
            setSongs={setSongs}
            isPlaying={isPlaying}
            audioRef={audioRef}
            songs={songs}
            song={song}
            setCurrentSong={setCurrentSong}
            id={song.id}
            key={song.id}
            isPlayListSelected={isPlayListSelected}
            deletePlaylist={deletePlaylist}
          />
        ))}
<Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        // action={action}
      />
      </div>
    </div>
  );
};

export default Library;
