import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, TextField } from "@mui/material";
import userServices from "../services/userServices";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import { useNavigate } from "react-router-dom";
import { deepOrange, deepPurple } from "@mui/material/colors";

const Nav = ({ setLibraryStatus, libraryStatus}) => {

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState({})
  const navigate = useNavigate();

  const [snackBarMessage, setSnackBarMessage] = useState("")



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

  const handleLogout = (e) =>{
    userServices.logout().then(response => {
      localStorage.clear()
      navigate('/login');
      
    })
    .catch(err=>{

    })
  }


  return (
    <nav>
      <h1 style={{position:"relative",left:"1em"}}>Waves</h1>
      <div className="navbar-nav flex-row" style={{position:"relative", left:"18em"}}>
      <button
        onClick={() => {
          setLibraryStatus(!libraryStatus);
        }}
      >
        Library
        <FontAwesomeIcon icon={faMusic} />
      </button>
      <button className="mx-2"
        onClick={handleClickOpen}
      >
        Create Playlist
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <button className="mx-2"
        onClick={handleLogout}
      >
        Logout
        <FontAwesomeIcon icon={faSignOut} />
      </button>

      <Stack direction="row" spacing={2}>
      <Avatar sx={{ bgcolor: deepPurple[500], height:44, width:44 }} className="mt-1">{user.name}</Avatar>
    </Stack>
      </div>

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
            userServices.savePlaylist(user.email,playList,[])
            .then(response => {
              setSnackBarMessage("Playlist created.")
              setSnackbarOpen(true)
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
        <DialogTitle>Create Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter name for your playlist.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Playlist"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
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

    </nav>
    
  );
};

export default Nav;
