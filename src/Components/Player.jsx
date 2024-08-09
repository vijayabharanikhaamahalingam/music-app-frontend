import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons/faFileDownload";
import { useEffect, useState } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";
import { Badge, Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, MenuItem, Select, Slider, Snackbar, Stack, TextField, Typography } from "@mui/material";
import userServices from "../services/userServices";
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DownloadIcon from '@mui/icons-material/Download';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';



const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  setSongInfo,
  songInfo,
  songs,
  setCurrentSong,
  id,
  setSongs,
  handlePlayList,
  comments,
  handleSaveComment,
  getComments,
  toogleLoop,
  saveLikes,
  likeCount
}) => {

  const[liked,setLiked]=useState(false)
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState({})
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [playList, setPlayList] = useState([])

  const [snackBarMessage, setSnackBarMessage] = useState("")

  const [saveComments, setSaveComments] = useState("")

  const [shuffle, setShuffle] = useState(false)

  const [repeat, setRepeat] = useState(false)



  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }

  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //useEffect
  const activeLibraryHandler = (nextPrev) => {
    setIsPlaying(true)
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
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
    console.log("Hey from useEffect form player JS");
  };
  //Event Handlers
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };


  const getTime = (time) =>
    Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      if(shuffle){
        songs=songs.sort(()=>Math.random() - 0.5)
      }
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
      getComments(songs[(currentIndex + 1) % songs.length].name)
    }
    if (direction === "skip-back") {
      if(shuffle){
        songs=songs.sort(()=>Math.random() - 0.5)
      }
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        // playAudio(isPlaying, audioRef);
        activeLibraryHandler(songs[songs.length - 1]);
        getComments(songs[songs.length - 1].name)

        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
      getComments(songs[(currentIndex - 1) % songs.length].name)
    }
    if (isPlaying) audioRef.current.play();
    
  };
  //adding the styles
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

const addToPlayListPopup = () => {
  userServices.getAllPlayLists(user.email)
  .then(response => {
    setPlayList(response.data.playList.playList)
    handleClickOpen()
  })
}

const handleChange = (event) => {
  setSelectedPlaylist(event.target.value)

}
const [volume, setVolume] = useState(30);

  const handleVolumeChange = (event, newValue) => {
    audioRef.current.volume=newValue/100
    setVolume(newValue);
  };

const saveComment = async(event) =>{
  handleSaveComment(saveComments)
  await setSaveComments("")
}

const handleComment = async(event)=>{
  await setSaveComments(event.target.value)
}

const handleShuffle = async(event)=>{
  await setShuffle(!shuffle)
}

const handleRepeat = async(event)=>{
  await setRepeat(!repeat)
  await toogleLoop(!repeat)
}


const handleLike =(event) =>{
  if (liked){
    saveLikes(likeCount-1)
    setLiked(!liked);
  }else{
    saveLikes(likeCount+1)
    setLiked(!liked);
  }
}

  return (
    <div className="player">
      <div className="time-control">
        <p style={{margin:"0px"}}>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
          }}
          className="track"
        >
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type="range"
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        <p style={{margin:"0px"}}>{songInfo.duration ? getTime(songInfo.duration) : "00:00"}</p>
      </div>
      <div className="play-control">
      <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
  <VolumeDown />
  <Slider aria-label="Volume" value={volume} onChange={handleVolumeChange} />
  <VolumeUp />
</Stack>
</Box>

{!shuffle &&
<Button onClick={handleShuffle}>
  <ShuffleIcon titleAccess="Shuffle"/>
</Button>
}

{shuffle &&
<Button onClick={handleShuffle}>
  <ShuffleOnIcon titleAccess="Shuffle Off"/>
</Button>
}

{!repeat &&
<Button onClick={handleRepeat}>
  <RepeatIcon titleAccess="Repeat"/>
</Button>
}
{repeat &&
<Button onClick={handleRepeat}>
  <RepeatOnIcon titleAccess="Repeat Off"/>
</Button>
}

{liked &&
  <Button onClick={handleLike}>
  <FavoriteIcon titleAccess="Unlike"/>
</Button>
}

{!liked &&
<Button onClick={handleLike}>
<FavoriteBorderIcon titleAccess="Like"/>
</Button>
}

        <Button
          onClick={() => skipTrackHandler("skip-back")}
          size="2x"
          className="skip-back"
        >
          <SkipPreviousIcon titleAccess="Previous"/>
        </Button>
        {!isPlaying ? (
          <Button
            onClick={playSongHandler}
            size="2x"
            className="play"
          >
            <PlayArrowIcon titleAccess="Play"/>
          </Button>
        ) : (
          <Button
            onClick={playSongHandler}
            size="2x"
            className="pause"
          >
            <PauseCircleIcon titleAccess="Pause"/>
          </Button>
        )}

        <Button
          onClick={() => skipTrackHandler("skip-forward")}
          size="2x"
          className="skip-forward"
        >
          <SkipNextIcon titleAccess="Next"/>
        </Button>
        {
        currentSong.audio && 
        <a href={currentSong.audio} download> 
        <DownloadIcon titleAccess="Download"/>
        </a>
        
      }
      {/* <FontAwesomeIcon
      onClick={handleLike}
      size="2x"
      className="skip-forward"
      icon="fa-regular fa-heart"
    
      />

<FontAwesomeIcon
      onClick={handleLike}
      size="2x"
      className="skip-forward"
      icon="fa-solid fa-heart"
    
      /> */}

<Button
      onClick={addToPlayListPopup}
      size="2x"
      className="skip-forward"
      >
        <PlaylistAddIcon titleAccess="Add to Playlist"/>
      </Button>

   <Badge badgeContent={likeCount} color="primary">
      <FavoriteIcon titleAccess="Like Count" color="action"/>
    </Badge>

      <TextField
          id="filled-textarea"
          label="Enter Comments"
          placeholder="Comments"
          multiline
          variant="filled"
          value={saveComments}
          onChange={handleComment}
        />
        <Button onClick={saveComment} disabled={!saveComments}>Post</Button>
   

<Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const playList = formJson.email;
            userServices.saveSongInPlaylist(user.email,selectedPlaylist,currentSong.name)
            .then(response => {
            setSnackBarMessage("Added to Playlist.")
              setSnackbarOpen(true)      
              handlePlayList(response.data.playList)        
          })
          .catch(error => {
            setSnackBarMessage(error.response.data.message)
            setSnackbarOpen(true)
          });
            console.log(playList);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add to Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select name of the playlist.
          </DialogContentText>
          <Select
          labelId="demo-simple-select-label" sx={{ minWidth: 200 }}
          id="demo-simple-select"
          value={selectedPlaylist}
          label="Playlist"
          onChange={handleChange}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add to Playlist</Button>
        </DialogActions>
      </Dialog>

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

export default Player;
