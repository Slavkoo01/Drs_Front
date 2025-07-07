import React, { useState } from "react";
import PostDropdown from "../Dropdowns/PostDropdown.js";
import { Link } from "react-router-dom";

export default function PostCard({
  user_id,
  username,
  profile_picture_url,
  post_id,
  post_text,
  post_image,
  onDelete,
  onEdit,
}) {
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState(post_text);
  const [imageUrl, setImageUrl] = useState(post_image);

  const handleCancel = () => {
    setText(post_text);
    setImageUrl(post_image);
    setEditable(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onEdit) {
      onEdit(post_id, text, imageUrl);
      setEditable(false);
    }
  };

  return (
    <div className="relative bg-white rounded shadow p-4 mt-4">
      {!editable ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <Link to={`/user/profile/${user_id}`}>
              <div className="flex items-center cursor-pointer">
                <img
                  src={
                    profile_picture_url ||
                    "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-semibold mt-2 ml-2 text-gray-800">{username}</span>
              </div>
            </Link>

            {onEdit && onDelete && (
              <PostDropdown onDelete={onDelete} onEdit={() => setEditable(true)} />
            )}
          </div>

          <p className="mb-2 text-gray-700">{post_text}</p>

          {post_image && (
            <img
              src={post_image}
              alt="Post"
              className="max-w-full rounded mb-2"
            />
          )}
        </div>
      ) : (
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <div className="flex items-center mb-2">
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

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Edit your post"
            rows={4}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full border rounded p-2"
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full rounded mb-2"
            />
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-emerald-500 text-white rounded"
            >
              Edit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
