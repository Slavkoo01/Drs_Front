import React, { useState } from "react";
import axios from "axios";


export default function CreatePostBox({ onPostCreated }) {
  /* ─────────── user / state ─────────── */
  const user = JSON.parse(localStorage.getItem("DRS_user") || "{}");
  const displayName = user?.username || "Friend";

  const [expanded, setExpanded] = useState(false);
  const [showImageField, setShowImageField] = useState(false);

  const [form, setForm] = useState({ text: "", imageUrl: "" });
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  /* ─────────── helpers ─────────── */
  const reset = () => {
    setForm({ text: "", imageUrl: "" });
    setPreview(null);
    setExpanded(false);
    setShowImageField(false);
    setMsg({ type: "", text: "" });
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim() && !form.imageUrl) {
      setMsg({
        type: "error",
        text: "Please write something or add an image."
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("DRS_user_token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}posts/create`,
        {
          text: form.text.trim() || null,
          image_url: form.imageUrl || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg({ type: "success", text: "Post submitted for approval." });
      setTimeout(() => {
        onPostCreated?.();
        reset();
      }, 1200);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Could not create post."
      });
    } finally {
      setLoading(false);
    }
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      {/* ---------- top row ---------- */}
      <div className=" flex space-x-3">
        {/* Avatar fixed top-left */}
        <img
          src={
            user?.profile_picture_url ||
            "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          }
          alt="avatar"
          className="w-10 h-10  rounded-full object-cover"
        />

        {/* Pill OR expanded form */}
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="flex text-left bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-full"
          >
            What&apos;s on your mind, {displayName}?
          </button>
        ) : (
          <form onSubmit={validateAndSubmit} className="flex-1  space-y-3">
            {/* Textarea */}
            <textarea
              value={form.text}
              onChange={(e) =>
                setForm((f) => ({ ...f, text: e.target.value }))
              }
              rows="3"
              placeholder={`What's on your mind, ${displayName}?`}
              className="w-full resize-none outline-none"
            />

            {/* Image‑URL input appears only if toggled */}
            {showImageField && (
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => {
                  const url = e.target.value.trim();
                  setForm((f) => ({ ...f, imageUrl: url }));
                  if (
                    url &&
                    !/^https?:\/\/.+\.(jpg|jpeg|png)$/i.test(url)
                  ) {
                    setMsg({
                      type: "error",
                      text: "Image URL must end with .jpg, .jpeg or .png"
                    });
                    setPreview(null);
                  } else {
                    setMsg({ type: "", text: "" });
                    setPreview(url || null);
                  }
                }}
                placeholder="Image URL (optional)"
                className="w-full border rounded p-2 text-sm"
              />
            )}

            {/* Preview */}
            {preview && (
              <div className="flex justify-center items-center">

                <img
                  src={preview}
                  alt="preview"
                  className=" mt-2 max-h-48 rounded border object-cover"
                />
              </div>
            )}

            {/* Alerts */}
            {msg.text && (
              <div
                className={`${msg.type === "error" ? "text-red-600" : "text-emerald-600"
                  } text-sm`}
              >
                {msg.text}
              </div>
            )}

            {/* Form actions */}
            <div className="mt-3 flex justify-between">
              <div>
                  {!showImageField && (
                <div className=" font-semibold text-gray-600 pt-2">

                    <Action
                    label="Photo"
                    icon={<i className="fas fa-image mt-1 mr-2"/>}
                    onClick={() => {
                      setExpanded(true);
                      setShowImageField(true);
                    }}
                    />
                </div>
                ) || (
                <div className=" font-semibold text-gray-600 pt-2">
                    <Action
                    label="Cancel Photo"
                    icon={<i className="fas fa-image mt-1 mr-2"/>}
                    onClick={() => {
                      setExpanded(true);
                      setShowImageField(false)
                      setPreview(null);
                      setForm((f) => ({ ...f, imageUrl: "" }));
                    }}
                    />
                </div>
                )}

              </div>
                  
              <div className="flex justify-end space-x-3">

                <button
                  type="button"
                  onClick={reset}
                  className="px-4 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1 text-sm rounded bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
                >
                  {loading ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* ---------- divider ---------- */}
      {!expanded && <hr />}

      {/* ---------- bottom actions (collapsed only) ---------- */}
      {!expanded && (
        <div className="flex justify-between font-semibold text-gray-600 pt-2">
          <Action
            label="Photo"
            icon={<i className="fas fa-image mt-1 mr-2"/>}
            onClick={() => {
              setExpanded(true);
              setShowImageField(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

/* Bottom action button */
const Action = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded-md flex-1 justify-center"
  >
    {icon}
    <span>{label}</span>
  </button>
);
