import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import Song from "./Song";
import Player from "./Player";
import Library from "./Library";
import userServices from "../services/userServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";




const MusicPlayer = () => {

  const songVal = {
    id: 0,
    name: '',
    artist: '',
    cover: '',
    audio: '',
    color: ["#EF8EA9", "#ab417f"],
    genre: '',
    language: '',
    active: true 
  }
  
  const [songs, setSongs] = useState([songVal]);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [libraryStatus, setLibraryStatus] = useState(true);
  const audioRef = useRef(null);
  const [user, setUser] = useState({})
  const [playList, setPlayList] = useState([])
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const [isPlayListSelected, setIsPlayListSelected] = useState(false)
  const [comments, setComments] = useState([])
  const navigate = useNavigate();
  const [loop,setLoop] = useState(false)
  const [likeCount,setLikeCount] = useState(0)



  const handlePlayList = async(data) =>{
    await setPlayList(prev => {
       return prev.map(list => {
        if(list.playList === data.playList){
          list.songNames = data.songNames
          return list
        } else {
          return list
        }
    })
    })
    // handlePlayListChange(data.playList,data.playList[0].playList)
  }
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      userServices.getSongs(foundUser.email)
        .then(response => {
          if(response && response.data.songs) {
            const songArray = [];
            const songs = response.data.songs;
            songs.forEach(song => {
              const songVal = {
                id: song._id,
                name: song.song_name,
                artist: song.artist,
                cover: song.image,
                audio: song.link,
                color: ["#EF8EA9", "#ab417f"],
                genre: song.genre,
                language: song.language,
                active: songs.indexOf(song) == 0 ? true: false 
              }
              songArray.push(songVal);
            });
            setSongs(songArray)
            setCurrentSong(songArray[0])
         userServices.getAllComments(songArray[0].name).then(response => {
          if(response.data.allComments){
            setComments(response.data.allComments)
          }
          
         })
         userServices.getAllLikes(songArray[0].name).then(response=>{
          if(response && response.data.allLikes.length>0) {
            setLikeCount(response.data.allLikes[0].like)
          }
         })
          }
        })
        .catch(error => {
          // setMessage(error.response.data.message);
        })

        userServices.getAllPlayLists(foundUser.email)
        .then(response =>{
          const playListVal = {
            playList:"All",
            _id:"1"

          }
          const playListInitVal = response.data.playList.playList;
          playListInitVal.unshift(playListVal);
          setPlayList(playListInitVal)
        })
        .catch(error=>{

        })
    } else {
      navigate('/login');
    }

  }, []);



  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //calculating percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    console.log();
    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };
  const songEndHandler = async() => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);

      getComments(songs[(currentIndex + 1) % songs.length].name)
    

    if (isPlaying) audioRef.current.play();
  };


const handlePlayListChange = async(playList,selectedPlaylist) => {
      if(selectedPlaylist == 'All') {
        setIsPlayListSelected(false)

        userServices.getSongs(user.email)
        .then(response => {
          if(response && response.data.songs) {
            const songArray = [];
            const songs = response.data.songs;
            songs.forEach(song => {
              const songVal = {
                id: song._id,
                name: song.song_name,
                artist: song.artist,
                cover: song.image,
                audio: song.link,
                color: ["#EF8EA9", "#ab417f"],
                genre: song.genre,
                language: song.language,
                active: songs.indexOf(song) == 0 ? true: false 
              }
              songArray.push(songVal);
            });
            setSongs(songArray)
            setCurrentSong(songArray[0])
          }
        })
        .catch(error => {
          // setMessage(error.response.data.message);
        })
      } else {
        const resultList = []
        if(playList) {
          setIsPlayListSelected(true)
          const playListVal = playList.filter(list=>list.playList == selectedPlaylist)[0].songNames;
          songs.filter((data) => {
            playListVal.some((val) => {
              if(data['name'] == val) {
                resultList.push(data)
              }
            }
            )
          })
        await setSongs(resultList)
        if(playListVal.length>0 && resultList.length == 0) {
          userServices.getSongs(user.email)
        .then(response => {
          if(response && response.data.songs) {
            const songArray = [];
            const resultArray = []
            const songs = response.data.songs;
            songs.forEach(song => {
              const songVal = {
                id: song._id,
                name: song.song_name,
                artist: song.artist,
                cover: song.image,
                audio: song.link,
                color: ["#EF8EA9", "#ab417f"],
                genre: song.genre,
                language: song.language,
                active: songs.indexOf(song) == 0 ? true: false 
              }
              songArray.push(songVal);
            });
            songArray.filter((data) => {
              playListVal.some((val) => {
                if(data['name'] == val) {
                  resultArray.push(data)
                }
              }
              )
            })
            if(resultArray.length>0) {
              setSongs(resultArray)
              setCurrentSong(resultArray[0])
            }
         
          }
        })
        .catch(error => {
          // setMessage(error.response.data.message);
        })
        }
        }
      }
}

const deletePlayList = () => {
  
  // setIsPlayListSelected(false)
  //    userServices.getSongs(user.email)
  //   .then(response => {
  //     if(response && response.data.songs) {
  //       const songArray = [];
  //       const songs = response.data.songs;
  //       songs.forEach(song => {
  //         const songVal = {
  //           id: song._id,
  //           name: song.song_name,
  //           artist: song.artist,
  //           cover: song.image,
  //           audio: song.link,
  //           color: ["#EF8EA9", "#ab417f"],
  //           genre: song.genre,
  //           language: song.language,
  //           active: songs.indexOf(song) == 0 ? true: false 
  //         }
  //         songArray.push(songVal);
  //       });
  //       setSongs(songArray)
  //       setCurrentSong(songArray[0])
  //     }
  //   })
  //   .catch(error => {
  //     // setMessage(error.response.data.message);
  //   })
}

const handleSaveComment = (comment) => {
  userServices.saveComments(user.name,currentSong.name,comment).then(response=>{
    if(response.data.allComments) {
      setComments(response.data.allComments)
    }
    
  })
}

const getComments = async(songName) => {
  userServices.getAllComments(songName).then(response => {
    if(response.data.allComments){
      setComments(response.data.allComments)
    }
    
   }).catch(error=>{
    console.log(error)
   })
    }

   const toogleLoop = async(data)=>{
    await setLoop(data)
   }

   const saveLikes = (like)=>{
    userServices.saveLikes(currentSong.name, like).then(response=>{
      if(response && response.data.allLikes.length>0) {
        setLikeCount(response.data.allLikes[0].like)
      }
    })
   }

   const handleSongChangeFromLibrary = (songName)=>{
    userServices.getAllComments(songName).then(response => {
      if(response.data.allComments){
        setComments(response.data.allComments)
      }
      
     })
     userServices.getAllLikes(songName).then(response=>{
      if(response && response.data.allLikes.length>0) {
        setLikeCount(response.data.allLikes[0].like)
      }
     })
   }

  return (
    <div>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus}
      />
      <Song currentSong={currentSong} comments={comments}/>
      <Player
        id={songs.id}
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
        handlePlayList={handlePlayList}
        comments={comments}
        handleSaveComment={handleSaveComment}
        getComments={getComments}
        toogleLoop={toogleLoop}
        saveLikes={saveLikes}
        likeCount={likeCount}
      />
      <Library
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        playList={playList}
        handlePlayListChange={handlePlayListChange}
        isPlayListSelected={isPlayListSelected}
        deletePlayList={deletePlayList}
        handleSongChangeFromLibrary={handleSongChangeFromLibrary}
        setIsPlaying={setIsPlaying}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        src={currentSong.audio}
        ref={audioRef}
        onEnded={songEndHandler}
        loop={loop}
        autoPlay={true}
      ></audio>
      

    </div>
  );
}

export default MusicPlayer;
