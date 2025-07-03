import React from "react";

export default function PostCard({
  username,
  profile_picture_url,
  post_text,
  post_image,
  onDelete,
  onEdit,
}) {
return (
  <div className="relative bg-white rounded shadow p-4 m-4">

    {/* Gornji deo: korisnik + dugmad */}
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <img
          src={
            profile_picture_url ||
            "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="font-semibold text-gray-800">{username}</span>
      </div>

      {/* Dugmad: Edit i Delete */}
      <div className="flex space-x-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-3 py-1 rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white text-lg px-3 py-1 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>

    {/* Tekst i slika */}
    <p className="mb-2 text-gray-700">{post_text}</p>

    {post_image && (
      <img
        src={post_image}
        alt="Post"
        className="max-w-full rounded mb-2"
      />
    )}
  </div>
);
}
