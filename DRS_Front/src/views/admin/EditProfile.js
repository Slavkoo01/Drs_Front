import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import UserNavbar from "components/Navbars/UserNavbar.js";

export default function EditProfile() {
  const { id } = useParams();
  const history = useHistory();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address: { street: "", city: "", country: "" },
    contact: { email: "", phone: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // --- fetch current data ---
  useEffect(() => {
    (async () => {
      try {
        // Koristimo DRS_user_token umesto samo token
        const token = localStorage.getItem("DRS_user_token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          address: { 
            street: data.address?.street || "", 
            city: data.address?.city || "", 
            country: data.address?.country || "" 
          },
          contact: { 
            email: data.contact?.email || "", 
            phone: data.contact?.phone || "" 
          },
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // --- helpers ---
  const handleChange = (path) => (e) => {
    const val = e.target.value;
    setForm((prev) => {
      const copy = { ...prev };
      // path e.g. "address.street"
      const keys = path.split(".");
      let ref = copy;
      keys.slice(0, -1).forEach((k) => (ref[k] = { ...ref[k] }));
      ref[keys[keys.length - 1]] = val;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("DRS_user_token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}users/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Uspešno ažuriranje - vratiti na profil
      history.push(`/users/${id}`);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <p>Loading…</p>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );

  return (
    <>
      <UserNavbar />
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 400, width: "100%" }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>

          {error && (
            <div style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {/* Ime / Prezime */}
          <input
            type="text"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange("first_name")}
            className="border rounded w-full p-2"
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange("last_name")}
            className="border rounded w-full p-2"
            required
          />

          {/* Kontakt */}
          <input
            type="email"
            placeholder="Email"
            value={form.contact.email}
            onChange={handleChange("contact.email")}
            className="border rounded w-full p-2"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.contact.phone}
            onChange={handleChange("contact.phone")}
            className="border rounded w-full p-2"
          />

          {/* Adresa */}
          <input
            type="text"
            placeholder="Street"
            value={form.address.street}
            onChange={handleChange("address.street")}
            className="border rounded w-full p-2"
          />
          <input
            type="text"
            placeholder="City"
            value={form.address.city}
            onChange={handleChange("address.city")}
            className="border rounded w-full p-2"
          />
          <input
            type="text"
            placeholder="Country"
            value={form.address.country}
            onChange={handleChange("address.country")}
            className="border rounded w-full p-2"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}