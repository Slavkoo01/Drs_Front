import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("DRS_user_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id); // ili decoded.user_id ili kako ti već stoji u tokenu
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
          `${process.env.REACT_APP_API_URL}friends/suggestions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // filtriraj da ne prikazuješ sebe
        const filteredUsers = response.data.users.filter(user => user.id !== currentUserId);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (currentUserId !== null) {
      fetchUsers();
    }
  }, [currentUserId]);

  const addFriend = async (userId) => {
    try {
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
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to send friend request", err);
    }
  };

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
              className={
                "font-semibold text-lg " +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              Users
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-left">Profile</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Surname</th>
              <th className="px-6 py-3 text-xs font-semibold text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => !user.blokiran) // filtriraj blokirane
              .map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <img
                      src={
                        user.profile_picture_url ||
                        "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      className="h-12 w-12 rounded-full border"
                      alt="profile"
                    />
                  </td>
                  <td className="px-6 py-4">{user.ime}</td>
                  <td className="px-6 py-4">{user.prezime}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => addFriend(user.id)}
                      className="bg-emerald-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Add Friend
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
