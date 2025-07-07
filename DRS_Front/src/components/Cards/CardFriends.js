import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

export default function CardFriends({ color }) {
  const [friends, setFriends] = useState([]);
  const history = useHistory();

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

  const removeFriend = async (userId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("DRS_user_token");
      await axios.delete(`${process.env.REACT_APP_API_URL}friends/${userId}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends((prev) => prev.filter((f) => f.id !== userId));
    } catch (err) {
      console.error("Failed to remove friend", err);
    }
  };

  return (
    <div
      className={`relative flex flex-col min-w-0 break-words w-full mt-4 mb-6 shadow-lg rounded ${
        color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
      }`}
    >
      <div className="rounded-t px-4 py-3 border-b border-gray-200">
        <h3 className={`font-semibold text-lg ${color === "light" ? "text-gray-800" : "text-white"}`}>
          Your Friends
        </h3>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-700">
              <th className="px-4 py-2">Profile</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Remove friend</th>
            </tr>
          </thead>
          <tbody>
            {friends.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  You have no friends yet...
                </td>
              </tr>
            ) : (
              friends.map((friend) => (
                <tr
                  key={friend.id}

                  
                >
                  <td className="px-4 py-3">
                    <img
                    onClick={() => history.push(`/user/profile/${friend.id}`)}
                      src={
                        friend.profile_picture_url ||
                        "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      alt={`${friend.first_name} ${friend.last_name}`}
                      className="h-10 w-10 cursor-pointer rounded-full border object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => history.push(`/user/profile/${friend.id}`)}>@{friend.username}</td>
                  <td className="px-4 py-3">{friend.first_name}</td>
                  <td className="px-4 py-3">{friend.last_name}</td>
                  <td className="px-4 py-3">{friend.email}</td>
                  <td className="px-4 py-3">
                    <button
                      style={{paddingLeft: 45}}
                      onClick={(e) => removeFriend(friend.id, e)}
                      className="text-red-500 border-none focus:outline-none"
                    >
                      <i className="fas fa-trash " />
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
      username: PropTypes.string,
      email: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      profile_picture_url: PropTypes.string,
    })
  ),
};
