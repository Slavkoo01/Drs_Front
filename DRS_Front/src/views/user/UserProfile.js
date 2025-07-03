import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserNavbar from "components/Navbars/UserNavbar.js";

export default function UserProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("DRS_user_token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!userData) return null;

  const {
    account: { blocked, profile_picture_url, user_type, username },
    address: { city, country, street },
    contact: { email, phone },
    first_name,
    last_name,
  } = userData;

  return (
  <>
    <UserNavbar />
    <div
      style={{
        minHeight: "calc(100vh - 64px)", // visina ekrana minus navbar visina (prilagodi ako treba)
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        maxWidth: 400,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <img
        src={profile_picture_url}
        alt="Profile"
        width={100}
        height={100}
        style={{ borderRadius: "50%", marginBottom: 20 }}
      />
      <h1>
        {first_name} {last_name}
      </h1>
      <p>Username: {username}</p>
      <h3>Contact</h3>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <h3>Address</h3>
      <p>Street: {street}</p>
      <p>City: {city}</p>
      <p>Country: {country}</p>
    </div>
  </>
);
}
