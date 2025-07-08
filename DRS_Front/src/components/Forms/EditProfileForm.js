import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditProfileModal({ isOpen, onClose, userData }) {

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
    keys.forEach((k, idx) => {
      
      if (idx < keys.length - 1) {
        ref[k] = { ...ref[k] };
        ref = ref[k];              
      } else {
        ref[k] = val;              
      }
    });

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
        onClose();
        window.location.reload();

      }, 1500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 shadow-xl flex items-center absolute justify-center z-50 bg-transparent bg-opacity-50">

      <div className="bg-white rounded-lg p-3 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        {msg.text && (
          <div
            className={`mb-3 p-2 rounded text-sm font-medium ${msg.type === "success" ? "bg-emerald-200 text-emerald-500" : "bg-red-200 text-red-500"
              }`}
          >
            {msg.text}
          </div>
        )}

        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>

          <div className="text-center">
            <div className=" flex items-center justify-center mb-3">

              <img
                src={
                  imagePreview ||
                  "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                }
                alt="avatar preview"
                className="shadow-xl rounded-full max-h-150-px max-w-150-px "
              />
            </div>
            <input
              type="text"
              value={form.profile_picture_url}
              onChange={handleImageUrlChange}
              placeholder="Image URL"
              className="max-w-250-px p-2 mb-3 border rounded"
            />
          </div>

          <input
            type="text"
            value={form.first_name}
            onChange={handleChange("first_name")}
            placeholder="First name"
            className="max-w-250-px p-2 mb-3 border rounded"
          />
          <input
            type="text"
            value={form.last_name}
            onChange={handleChange("last_name")}
            placeholder="Last name"
            className="max-w-250-px p-2 mb-3 border rounded"
          />

          {/* contact */}
          <input
            type="text"
            value={form.contact.phone}
            onChange={handleChange("contact.phone")}
            pattern="^[+0-9 ]{6,15}$"
            placeholder="Phone"
            className="max-w-250-px p-2 mb-3 border rounded"
          />

          {/* address */}
          <input
            type="text"
            value={form.address.street}
            onChange={handleChange("address.street")}
            placeholder="Street"
            className="max-w-250-px p-2 mb-3 border rounded"
          />
          <input
            type="text"
            value={form.address.city}
            onChange={handleChange("address.city")}
            placeholder="City"
            className="max-w-250-px p-2 mb-3 border rounded"
          />
          <input
            type="text"
            value={form.address.country}
            onChange={handleChange("address.country")}
            placeholder="Country"
            className="max-w-250-px p-2 mb-3 border rounded"
          />
          {/* Add more fields as needed */}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-lightBlue-500 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
