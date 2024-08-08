import { instance, protectedInstance } from "./instance";

// define the user services
const userServices = {
    // register a user
    register: async (name, email, password, preferedLang) => {
        // make a POST request to the server
        return await instance.post('/users/register', {
            name,
            email,
            password,
            preferedLang
        });
    },
    // login a user
    login: async (email, password) => {
        // make a POST request to the server
        return await instance.post('/users/login', {
            email,
            password
        }, {
            withCredentials: true
        });
    },
    // get the user
    getUser: async () => {
        // make a GET request to the server
        return await protectedInstance.get('/users/profile');
    },
    checkAuth: async () => {
        return await protectedInstance.get('/users/checkAuth');
    },
    logout: async () => {
        return await protectedInstance.get('/users/logout');
    },
    langPreference: async () =>{
        return await protectedInstance.get('/users/langPreference');
    },
    getSongs: async (email) =>{
        return await protectedInstance.post('/songs/songs',{
            email
        });
    },

    savePlaylist: async(email,playList,songNames ) => {
        return await protectedInstance.post('/users/savePlaylist',{
            email,
            playList,
            songNames
        });
    },

    getAllPlayLists: async(email) => {
        return await protectedInstance.post('/users/getAllPlaylist',{
            email
        });
    },

    saveSongInPlaylist: async(email,playList,songNames ) => {
        return await protectedInstance.post('/users/saveSongInPlaylist',{
            email,
            playList,
            songNames
        });
    },

    deletePlaylist: async(songName, selectedPlaylist, email) => {
        return await protectedInstance.post('/users/deletePlaylist',{
            songName, selectedPlaylist, email
        }); 
    },

    getAllComments: async(songName) => {
        return await protectedInstance.post('/users/getAllComments',{
            songName
        }); 
    },

    saveComments: async(userName,song,comments,likes) => {
        return await protectedInstance.post('/users/saveComments',{
            userName,song,comments,likes
        }); 
    },
    getAllLikes: async(song) => {
        return await protectedInstance.post('/users/getAllLikes',{
            song
        }); 
    },

    saveLikes: async(song,likes) => {
        return await protectedInstance.post('/users/saveLikes',{
            song,likes
        }); 
    },
    
}

export default userServices;