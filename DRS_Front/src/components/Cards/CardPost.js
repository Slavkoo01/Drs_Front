
import React from "react";

export default function PostCard({ username, profile_picture_url, post_text, post_image, onApprove, onReject }) {
  return (
    <div className="bg-white rounded shadow p-4 m-4">
      <div className="flex items-center mb-2">
        <img
          src={profile_picture_url || "https://default-url.com/default.jpg"}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="font-semibold">{username}</span>
      </div>
      <p className="mb-2">{post_text}</p>
      {post_image && (
        <img
          src={post_image}
          alt="Post"
          className="max-w-full rounded mb-2"
        />
      )}
      <div className="flex justify-end space-x-2">
        <button onClick={onApprove} className="bg-emerald-500 text-white px-4 py-1 rounded mr-3">
          Accept
        </button>
        <button onClick={onReject} className="bg-red-500 text-white px-4 py-1 rounded">
          Reject
        </button>
      </div>
    </div>
  );
}
