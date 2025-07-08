import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'

import axios from "axios";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}friends/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.friend_requests || []);
      } catch (err) {
        console.error("Failed to load friend requests", err);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (userId) => {
  try {
    const token = localStorage.getItem("DRS_user_token");
    await axios.post(`${process.env.REACT_APP_API_URL}friends/${userId}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests((prev) => prev.filter((r) => r.user_id !== userId));
  } catch (err) {
    console.error("Failed to accept friend request", err);
  }
};

const handleReject = async (userId) => {
  try {
    const token = localStorage.getItem("DRS_user_token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}friends/${userId}/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    setRequests((prev) => prev.filter((r) => r.user_id !== userId));
  } catch (err) {
    console.error("Failed to reject friend request", err);
  }
};

  return (
    <>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No friend requests at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((req) => (
              <div key={req.request_id} className="bg-white shadow p-4 rounded">
                <h4 className="font-semibold mb-1 cursor-pointer" onClick={() => history.push(`/user/profile/${req.user_id}`)}>{req.first_name} {req.last_name}</h4>
                <p className="text-sm text-gray-500 mb-2 cursor-pointer" onClick={() => history.push(`/user/profile/${req.user_id}`)}>@{req.username}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req.user_id)}
                    className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600"
                    >
                    Accept
                    </button>
                    <button
                    onClick={() => handleReject(req.user_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                    Reject
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
