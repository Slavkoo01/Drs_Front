import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");

        const [friendsRes, suggestedRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}friends`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}friends/suggested`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFriends(friendsRes.data.friends || []);
        setSuggestedFriends(suggestedRes.data.users || []);
      } catch (err) {
        console.error("Error loading friends data:", err);
      }
    };

    fetchFriends();
  }, []);

  const addFriend = async (userId) => {
    try {
      const token = localStorage.getItem("DRS_user_token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}friends/${userId}/add`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh state
      setSuggestedFriends((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to add friend", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {friends.length === 0 ? (
          <p className="text-gray-500 col-span-full">You have no friends yet 😢</p>
        ) : (
          friends.map((friend) => (
            <div key={friend.id} className="p-4 bg-white shadow rounded">
              <img
                src={friend.profile_picture_url || "https://default-url.com/default.jpg"}
                alt={friend.username}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <h4 className="text-center font-semibold">{friend.username}</h4>
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Suggested Friends</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {suggestedFriends.length === 0 ? (
          <p className="text-gray-500 col-span-full">No users to suggest</p>
        ) : (
          suggestedFriends.map((user) => (
            <div key={user.id} className="p-4 bg-white shadow rounded">
              <img
                src={user.profile_picture_url || "https://default-url.com/default.jpg"}
                alt={user.username}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <h4 className="text-center font-semibold mb-2">{user.username}</h4>
              <button
                onClick={() => addFriend(user.id)}
                className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600 block mx-auto"
              >
                Add Friend
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
