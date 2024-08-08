import { useState } from "react"
import userServices from "../services/userServices";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message,setMessage]= useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // login the user
        userServices.login(email, password)
            .then(response => {

                // clear the form
                setEmail('');
                setPassword('');
                setMessage('');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // redirect to dashboard or AdminDashboard
                navigate('/dashboard');
            })
            .catch(error => {
                setMessage(error.response.data.message);
            })
    }

  return (
      <div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                            <div className="card">
                                <div className="card-header">
                                    Login
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleLogin}>
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
                                        <button type="submit" className="btn btn-primary" disabled={!(email && password)}>Login</button>
                                        {message &&
                                            <span className="text-danger mx-3">{message}</span>
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

export default Login