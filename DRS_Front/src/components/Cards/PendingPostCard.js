import React from "react";

export default function PendingPostCard({ post_text, post_image, onApprove, onReject }) {
  return (
    <div className="bg-yellow-50 rounded shadow p-4 m-4 border border-yellow-400">
      <p className="mb-2 font-semibold italic">Pending post:</p>
      <p className="mb-2">{post_text}</p>
      {post_image && (
        <img
          src={post_image}
          alt="Pending Post"
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
