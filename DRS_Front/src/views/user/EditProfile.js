import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import UserNavbar from "components/Navbars/UserNavbar.js";

export default function EditProfile() {
  const { id }     = useParams();
  const history    = useHistory();

  /* ---------------- state ---------------- */
  const [form, setForm] = useState({
    first_name: "", last_name: "",
    address: { street: "", city: "", country: "" },
    contact : { email : "", phone : "" },
    profile_picture_url: ""         // stari URL
  });

  const [pictureFile,    setPictureFile   ] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving , setSaving ] = useState(false);
  const [error  , setError  ] = useState(null);

  /* --------- fetch trenutnog profila --------- */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        if (!token) { setError("No authentication token"); return; }

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm({
          first_name: data.first_name || "",
          last_name : data.last_name  || "",
          address   : {
            street : data.address?.street  || "",
            city   : data.address?.city    || "",
            country: data.address?.country || ""
          },
          contact   : {
            email: data.contact?.email || "",
            phone: data.contact?.phone || ""
          },
          profile_picture_url: data.account?.profile_picture_url || ""
        });

        setPicturePreview(data.account?.profile_picture_url || null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally { setLoading(false); }
    })();
  }, [id]);

  /* -------------- helpers -------------- */
  const handleChange = (path) => (e) => {
    const val = e.target.value;
    setForm(prev => {
      const copy = { ...prev };
      const keys = path.split(".");
      let ref = copy;
      keys.slice(0, -1).forEach(k => (ref[k] = { ...ref[k] }));
      ref[keys.at(-1)] = val;
      return copy;
    });
  };

  const handlePicture = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPictureFile(f);
    setPicturePreview(URL.createObjectURL(f));
  };

  /* -------------- submit -------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);

    try {
      const token = localStorage.getItem("DRS_user_token");
      if (!token) { setError("No authentication token"); return; }

      const fd = new FormData();
      fd.append("data", JSON.stringify(form));
      if (pictureFile) fd.append("profile_picture", pictureFile);

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}users/${id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      /*  ⬇︎ UPDATE localStorage -> da dropdown dobije novi avatar  */
      const stored = JSON.parse(localStorage.getItem("DRS_user") || "{}");
      stored.profile_picture_url =
        res.data.profile_picture_url || form.profile_picture_url;
      localStorage.setItem("DRS_user", JSON.stringify(stored));

      history.push(`/users/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    } finally { setSaving(false); }
  };

  /* -------------- UI stanja -------------- */
  if (loading) return <FullScreenCenter>Loading…</FullScreenCenter>;
  if (error)   return <FullScreenCenter><span className="text-red-600">{error}</span></FullScreenCenter>;

  /* -------------- render -------------- */
  return (
    <>
      <UserNavbar />
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center p-5">
        <form onSubmit={handleSubmit}
              className="space-y-4 w-full max-w-md bg-white shadow rounded p-6">

          <h2 className="text-2xl font-bold text-center">Edit Profile</h2>

          {/*  preview + upload  */}
          <div className="text-center">
            <img
              src={
                picturePreview ||
                form.profile_picture_url ||
                "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
              }
              alt="avatar preview"
              className="mx-auto mb-2 w-28 h-28 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePicture}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0 file:text-sm file:bg-emerald-50
                         file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          {/* Ime / prezime */}
          <Input value={form.first_name} onChange={handleChange("first_name")} placeholder="First name" required />
          <Input value={form.last_name } onChange={handleChange("last_name" )} placeholder="Last name"  required />

          {/* Kontakt */}
          <Input type="email" value={form.contact.email}
                 onChange={handleChange("contact.email")}
                 placeholder="Email" required />
          <Input value={form.contact.phone}
                 onChange={handleChange("contact.phone")}
                 placeholder="Phone" />

          {/* Adresa */}
          <Input value={form.address.street}
                 onChange={handleChange("address.street")}
                 placeholder="Street" />
          <Input value={form.address.city}
                 onChange={handleChange("address.city")}
                 placeholder="City" />
          <Input value={form.address.country}
                 onChange={handleChange("address.country")}
                 placeholder="Country" />

          <button type="submit"
                  disabled={saving}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}

/* ---------- pomoćne komponente ---------- */

const Input = ({ type = "text", ...props }) => (
  <input type={type}
         className="border rounded w-full p-2"
         {...props} />
);

const FullScreenCenter = ({ children }) => (
  <div className="min-h-screen flex justify-center items-center">{children}</div>
);
