import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.users)
        setUsers(response.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const toggleBlockUser = async (id, block) => {
    try {
      if(block){

        const token = localStorage.getItem("DRS_user_token");
        await axios.post(
          `${process.env.REACT_APP_API_URL}admin/users/${id}/block`,
          { block },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("blokiran: ", block)
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === id ? { ...u, blokiran: block ? 1 : 0} : u))
      );
      
    } else {
      const token = localStorage.getItem("DRS_user_token");
        await axios.post(
          `${process.env.REACT_APP_API_URL}admin/users/${id}/unblock`,
          { block },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("blokiran: ", block)
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === id ? { ...u, blokiran: block ? 1 : 0} : u))
      );
    }
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
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
              className={
                "font-semibold text-lg " +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              Users
            </h3>
          </div>
        </div>
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
              <th className="px-6 py-3 text-xs font-semibold text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <img
                  src={user.account?.profile_picture_url || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}
                  className="h-12 w-12 rounded-full border"
                  alt="profile"
                />

                </td>
                <td className="px-6 py-4">{user.ime}</td>
                <td className="px-6 py-4">{user.prezime}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBlockUser(user.id, !user.blokiran)}
                    className={` py-2  rounded text-white text-sm   ${
                      user.blokiran ? "bg-emerald-500 px-4" : "bg-red-500 px-6"
                    }`}
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

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
