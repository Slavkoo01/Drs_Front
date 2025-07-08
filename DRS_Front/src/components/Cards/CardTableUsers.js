import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([]);
  const history = useHistory();
  // ───── FETCH SVI KORISNICI (admin) ─────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}admin/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // ───── BLOK / UNBLOCK ─────
  const toggleBlockUser = async (id, block) => {
    try {
      const token = localStorage.getItem("DRS_user_token");
      const url = block
        ? `${process.env.REACT_APP_API_URL}admin/users/${id}/block`
        : `${process.env.REACT_APP_API_URL}admin/users/${id}/unblock`;

      await axios.post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, blokiran: block ? 1 : 0 } : u))
      );
    } catch (err) {
      console.error("Error updating user block status", err);
    }
  };

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <h3
          className={
            "font-semibold text-lg " +
            (color === "light" ? "text-blueGray-700" : "text-white")
          }
        >
          Users
        </h3>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-left">Profile</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Surname</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Username</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">Email</th>
              <th className="px-6 py-3 text-xs font-semibold text-left">City</th>
              <th className="px-6 py-3 text-xs font-semibold text-left"></th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <img
                    src={
                      user.profile_picture_url ||
                      "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                    }
                    className="h-12 w-12 rounded-full border cursor-pointer" onClick={() => {history.push(`/admin/profile/${user.id}`)}}
                    alt="profile"
                  />
                </td>

                <td className="px-6 py-4 cursor-pointer" onClick={() => {history.push(`/admin/profile/${user.id}`)}}>{user.ime}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => {history.push(`/admin/profile/${user.id}`)}}>{user.prezime}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => {history.push(`/admin/profile/${user.id}`)}}>{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.grad}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBlockUser(user.id, !user.blokiran)}
                    className={
                      "py-2 rounded text-white text-sm " +
                      (user.blokiran ? "bg-emerald-500 px-4" : "bg-red-500 px-6")
                    }
                  >
                    {user.blokiran ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CardTable.defaultProps = { color: "light" };

CardTable.propTypes = { color: PropTypes.oneOf(["light", "dark"]) };
