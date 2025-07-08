import React, { useState } from "react";
import axios from "axios";



export default function Register() {
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    ulica: "",
    grad: "",
    drzava: "",
    email: "",
    broj_telefona: "",
    korisnicko_ime: "",
    lozinka: "",
  });

  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUndo = () => {
  setFormData({
    ime: "",
    prezime: "",
    ulica: "",
    grad: "",
    drzava: "",
    email: "",
    broj_telefona: "",
    korisnicko_ime: "",
    lozinka: "",
  });
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/register`,
        formData
      );
      setSuccessMessage("Successfully registered! Check your email.");
      console.log(response.data);
      window.location.reload();

      
    } catch (error) {
      if (error.response && error.response.data.error) {
        setRegisterError(error.response.data.error);
      } else {
        setRegisterError("Something went wrong. Please try again later.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <br></br>
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Sign up with credentials</small>
                </div>
                <form onSubmit={handleRegister}>
                  {[
                    { label: "Name", name: "ime" },
                    { label: "Surname", name: "prezime" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Username", name: "korisnicko_ime" },
                    { label: "Password", name: "lozinka", type: "password" },
                    { label: "Street", name: "ulica" },
                    { label: "City", name: "grad" },
                    { label: "Country", name: "drzava" },
                    { label: "Phone number", name: "broj_telefona" },
                  ].map(({ label, name, type = "text" }) => (
                    <div className="relative w-full mb-3" key={name}>
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={label}
                        required
                      />
                    </div>
                  ))}

                  {registerError && (
                    <div className="text-red-500 text-sm mb-4 text-center">
                      {registerError}
                    </div>
                  )}
                  {successMessage && (
                    <div className="text-emerald-500 text-sm mb-4 text-center">
                      {successMessage}
                    </div>
                  )}

                  <div className="text-center mt-6 flex">
                    <button
                      type="submit"
                      className="bg-blueGray-800 text-white mr-4 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                    >
                      Create Account
                    </button>
                    <button onClick={handleUndo} type="button">
                      <i className="fas fa-undo bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
