import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory  } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/login`,
        {
          korisnicko_ime: username,
          lozinka: password,
        }
      );

      const token = response.data.token;
      const decoded = jwtDecode(token);

      localStorage.setItem("DRS_user_token", token);
      localStorage.setItem("DRS_user", JSON.stringify(decoded));

      // You can log decoded if you want to debug it
      console.log("Logged in:", decoded);

      // Redirect to feed (or admin panel if role is admin)
      navigate.push("/");
    } catch (error) {
    if (error.response && error.response.data?.error) {
      // Show specific message from backend (like blocked, pending, etc.)
      setLoginError(error.response.data.error);
    } else {
      setLoginError("An error occurred. Please try again later.");
    }
    console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <br />
                  <small>Sign in with credentials</small>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Username
                    </label>
                    <input
                      
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Username"
                      required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <div className="text-center mt-6">
                    
                    {loginError && (
                    <div className="text-red-500 text-sm mb-4 text-center">
                      {loginError}
                    </div>
                    )}

                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2"></div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-blueGray-200">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
