import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditProfileForm({ isOpen, onClose, userData }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address: { street: "", city: "", country: "" },
    contact: { email: "", phone: "" },
    profile_picture_url: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Disable scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Set initial form state from userData
  useEffect(() => {
    if (userData) {
      setForm({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        address: {
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          country: userData.address?.country || "",
        },
        contact: {
          email: userData.contact?.email || "",
          phone: userData.contact?.phone || "",
        },
        profile_picture_url: userData.account?.profile_picture_url || "",
      });
      setImagePreview(userData.account?.profile_picture_url || "");
    }
  }, [userData]);

  const handleChange = (path) => (e) => {
    const val = e.target.value;
    setForm((prev) => {
      const copy = { ...prev };
      const keys = path.split(".");
      let ref = copy;
      keys.slice(0, -1).forEach((k) => (ref[k] = { ...ref[k] }));
      ref[keys.at(-1)] = val;
      return copy;
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, profile_picture_url: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      const token = localStorage.getItem("DRS_user_token");
      if (!token) {
        setMsg({ type: "error", text: "Missing authentication token" });
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}users/${userData.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const stored = JSON.parse(localStorage.getItem("DRS_user") || "{}");
      stored.profile_picture_url =
        response.data.profile_picture_url || form.profile_picture_url;
      localStorage.setItem("DRS_user", JSON.stringify(stored));

      setMsg({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => {
        setMsg({ type: "", text: "" });
        onClose(); // close modal after success
      }, 1500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="mt-6 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-4 max-w-sm sm:max-w-xs">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        {msg.text && (
          <div
            className={`mb-3 p-2 rounded text-sm font-medium ${
              msg.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-center">
            <img
              src={
                imagePreview ||
                "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
              }
              alt="avatar preview"
              className="mx-auto mb-2 w-24 h-24 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <input
              type="text"
              value={form.profile_picture_url}
              onChange={handleImageUrlChange}
              placeholder="Image URL"
              className=" px-3 py-2 border rounded text-sm"
            />
          </div>

          <Input value={form.first_name} onChange={handleChange("first_name")} placeholder="First Name" required />
          <Input value={form.last_name} onChange={handleChange("last_name")} placeholder="Last Name" required />
          <Input type="email" value={form.contact.email} onChange={handleChange("contact.email")} placeholder="Email" required />
          <Input value={form.contact.phone} onChange={handleChange("contact.phone")} placeholder="Phone" />
          <Input value={form.address.street} onChange={handleChange("address.street")} placeholder="Street" />
          <Input value={form.address.city} onChange={handleChange("address.city")} placeholder="City" />
          <Input value={form.address.country} onChange={handleChange("address.country")} placeholder="Country" />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable input
const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    className="border rounded  px-3 py-2 text-sm text-gray-700"
    {...props}
  />
);
