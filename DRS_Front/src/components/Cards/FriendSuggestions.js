import React, { useEffect, useState } from "react";
import axios from "axios";
import {useHistory} from 'react-router-dom'
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export default function FriendSuggestions({ color }) {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const token = localStorage.getItem("DRS_user_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}search/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const filtered = response.data.users.filter(
          (u) => u.id !== currentUserId && !u.blokiran
        );

        setUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (currentUserId !== null) fetchUsers();
  }, [currentUserId]);

  const addFriend = async (userId) => {
    try {
      setBusyId(userId);
      const token = localStorage.getItem("DRS_user_token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}friends/${userId}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, friendship_status: "Pending" } : u
        )
      );
    } catch (err) {
      console.error("Failed to send friend request", err);
    } finally {
      setBusyId(null);
    }
  };

  const removeFriendRequest = async (userId) => {
    try {
      setBusyId(userId);
      const token = localStorage.getItem("DRS_user_token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}friends/${userId}/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, friendship_status: "none" } : u
        )
      );
    } catch (err) {
      console.error("Failed to remove friend", err);
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      u.username?.toLowerCase().includes(term) ||
      u.first_name?.toLowerCase().includes(term) ||
      u.last_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div
      className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
        color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
      }`}
    >
      <div className="rounded-t px-4 py-3 border-b">
        <h3
          className={`font-semibold text-lg ${
            color === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          Suggested Friends
        </h3>
      </div>

      <div className="px-4 py-2">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 border rounded ${
            color === "dark" ? "text-black bg-white" : "text-black"
          }`}
        />
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="w-full bg-transparent table-auto">
          <thead>
            <tr className="text-left bg-gray-100 text-sm text-gray-700">
              <th className="px-6 py-3">Profile</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No matching users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3">
                    <img
                      src={
                        user.profile_picture_url ||
                        "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      className="h-10 w-10 rounded-full border object-cover"
                      alt="profile"
                    />
                  </td>
                  <td className="px-6 py-3 cursor-pointer" onClick={() => history.push(`/user/profile/${user.id}`)}>@{user.username}</td>
                  <td className="px-6 py-3 cursor-pointer" onClick={() => history.push(`/user/profile/${user.id}`)}>{user.first_name}</td>
                  <td className="px-6 py-3 cursor-pointer" onClick={() => history.push(`/user/profile/${user.id}`)}>{user.last_name}</td>
                  <td className="px-6 py-3">
                    {user.friendship_status === "Pending" ? (
                      <button
                        disabled={busyId === user.id}
                        onClick={() => removeFriendRequest(user.id)}
                        className="bg-yellow-400 text-black text-sm px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        {busyId === user.id ? "Cancelling..." : "Pending Request"}
                      </button>
                    ) : (
                      <button
                        disabled={busyId === user.id}
                        onClick={() => addFriend(user.id)}
                        className="bg-emerald-500 text-white text-sm px-3 py-1 rounded hover:bg-emerald-600"
                      >
                        {busyId === user.id ? "Sending..." : "Add Friend"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

FriendSuggestions.defaultProps = {
  color: "light",
};

FriendSuggestions.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
