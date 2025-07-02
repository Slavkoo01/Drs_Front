import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function CardFriends({ color }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data.friends || []);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (userId) => {
    try {
      const token = localStorage.getItem("DRS_user_token");
      await axios.delete(`${process.env.REACT_APP_API_URL}friends/${userId}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ukloni prijatelja iz liste nakon uspešnog brisanja
      setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== userId));
    } catch (err) {
      console.error("Failed to remove friend", err);
    }
  };

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-emerald-500" : "bg-lightBlue-900 text-white")
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
              Your Friends
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto p-4">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-left">Profile</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">First Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Last Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {friends.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={"text-" + (color === "light" ? "gray-500" : "gray-300") + " text-center py-4"}
                >
                  You have no friends yet ...
                </td>
              </tr>
            ) : (
              friends.map((friend) => (
                <tr key={friend.id}>
                  <td className="px-6 py-4">
                    <img
                      src={
                        friend.profile_picture_url ||
                        "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      className="h-12 w-12 rounded-full border object-cover"
                      alt={`${friend.first_name} ${friend.last_name}`}
                    />
                  </td>
                  <td className="px-6 py-4">{friend.first_name}</td>
                  <td className="px-6 py-4">{friend.last_name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
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

CardFriends.defaultProps = {
  color: "light",
  friends: [],
};

CardFriends.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      profile_picture_url: PropTypes.string,
    })
  ),
};
