import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createPopper } from "@popperjs/core";
import { useHistory } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // ← Add this if using react-icons

export default function FriendSearch({ color = "light" }) {
  const history = useHistory();

  const btnRef = useRef(null);
  const popperRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [myId] = useState(() => {
    try {
      const token = localStorage.getItem("DRS_user_token");
      return token ? jwtDecode(token).id : null;
    } catch {
      return null;
    }
  });

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("DRS_user_token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}search/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!cancelled) {
          const list = res.data.users.filter(
            (u) => u.id !== myId && !u.blocked
          );
          setAllUsers(list);
        }
      } catch (err) {
        console.error("Friend list fetch failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [myId]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return allUsers;

    const term = search.trim().toLowerCase();
    return allUsers.filter(
      (u) =>
        (u.username && u.username.toLowerCase().includes(term)) ||
        (`${u.first_name} ${u.last_name}`.toLowerCase().includes(term))
    );
  }, [search, allUsers]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popperRef.current &&
        !popperRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && btnRef.current && popperRef.current) {
      createPopper(btnRef.current, popperRef.current, {
        placement: "bottom-start",
      });
    }
  }, [open]);

  return (
    <>
      {/* Search Input with Icon */}
      <div ref={btnRef} className="bg-white shadow-md rounded-full">
        <input
          value={search}
          onChange={(e) => {
            if (e.target.value.trim() !== "") {
              setOpen(true);
              setSearch(e.target.value)
            } else {
              setSearch("")
              setOpen(false)
            }
          }}

          placeholder={"Search friends..."}
          className={`pl-4 pr-10 py-2 border-none  focus:outline-none  bg-transparent border-none rounded-full text-sm "
            }`}
        />
        <i className="fas fa-search mr-3"></i>

      </div>

      {/* Dropdown List */}
      <div
        style={{width: 206.22, maxHeight: 250}}
        ref={popperRef}
        className={`z-50 mt-2 bg-white text-gray-800 rounded-lg shadow-lg w-screen max-h-64 overflow-y-auto ${open ? "block" : "hidden"
          }`}
      >
        {suggestions.length === 0 ? (
          <div className="px-4 py-3 text-sm  text-gray-400">No users found.</div>
        ) : (
          suggestions.map((u) => (
            <div
              key={u.id}
              className="flex gap-3 items-start px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => {
                history.push(`/user/profile/${u.id}`)
                setOpen(false)
              }}
            >
              <img
                src={
                  u.profile_picture_url ||
                  "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                }
                alt="avatar"
                className="h-10 w-10 mr-3 rounded-full border object-cover"
              />
              <div className="flex flex-col">
                <div className="font-medium text-sm">
                  {u.first_name} {u.last_name}
                </div>
                <div className="text-xs text-gray-500">@{u.username}</div>
                {u.friendship_status === "Accepted" && (
                  <div className="text-xs text-green-600 mt-1">Friends</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
