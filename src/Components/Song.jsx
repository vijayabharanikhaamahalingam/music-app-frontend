import { Card, CardActionArea, CardContent, Divider, Typography } from "@mui/material";
import React from "react";


const Song = ({ currentSong,comments }) => {
  return (
    <div className="song-container">
      <img src={currentSong.cover} alt={currentSong.name} />
      <h2>{currentSong.name}</h2>
      <h3>{currentSong.artist}</h3>

      {(comments && comments.length> 0) &&

<Card sx={{ maxWidth: 1000, maxHeight: 100, overflowY:"auto",position:"relative", left:"40em" , top:"-20em"}} >
                <Typography gutterBottom variant="h6" component="div" className="text-success ms-2">
      Comments
    </Typography>
{comments.map((comment) =>(
<CardActionArea>
<CardContent>
  <Typography gutterBottom variant="h5" component="div" className="text-primary">
  {comment.users}
  </Typography>
  <Divider />

  <Typography variant="subtitle1" color="text.secondary">
  {comment.comments}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    {"Commented on " + new Date(comment.createdAt).toLocaleDateString()}          </Typography>
</CardContent>
</CardActionArea>
        ))}
</Card>


}
    </div>
  );
};

export default Song;
