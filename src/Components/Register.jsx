import { useEffect, useState} from "react"
import userServices from "../services/userServices";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, preferedLang, theme) {
  return {
    fontWeight:
    preferedLang.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Register = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState ('');
    const [status,setStatus] = useState(0);
    const [langPreference,setLangPerference]= useState([]);
   
   
    useEffect(()=>{
        userServices.langPreference()
        .then(response =>{
            setLangPerference(response.data.song)
        })
    },[])

    const navigate = useNavigate();

    const theme = useTheme();
  const [preferedLang, setPreferedLang] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPreferedLang(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

    const handleRegister = (e) => {
        e.preventDefault();
        if(password.length<8){
            setMessage("password should be 8 characters or more")
            return;
        }

        // register the user
        userServices.register(name, email, password,preferedLang)
        .then(response => {
            setMessage(response.data.message);
            setStatus(response.status);


            // clear the form
            setName('');
            setEmail('');
            setPassword('');
            setMessage('');
            setStatus(0);
            setPreferedLang([])
            alert(response.data.message);
            // redirect to login page
            navigate('/login');
        })
        .catch(error => {
            setMessage(error.response.data.message);
        });
    }

  return (
      <div>
          <div className="container mt-5">
              <div className="row">
                  <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-header">
                                Register
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleRegister}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                      <input type="text" className="form-control" id="name" 
                                        onChange={(e) => setName(e.target.value)} value={name}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                      <input type="email" className="form-control" id="email" 
                                        onChange={(e) => setEmail(e.target.value)} value={email}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                      <input type="password" className="form-control" id="password" 
                                        onChange={(e) => setPassword(e.target.value)} value={password}
                                        />
                                    </div>
                                    <div className="mb-3">
                                    <InputLabel id="demo-multiple-chip-label">Language Preferences</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={preferedLang}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {langPreference.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, preferedLang, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
        </div>

                                    <button type="submit" className="btn btn-primary" disabled={!(name && email && password)} >Register</button>
                                    {message &&
                                            <span className={"mx-3 "+(status==200?"text-success":"text-danger")}>{message}</span>
                                        }
                                </form>
                            </div>
                      </div>
              </div>
          </div>
          </div>
          </div>
  )
}

export default Register