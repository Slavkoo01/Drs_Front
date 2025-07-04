import React, { useState, useEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const UserDropdown = () => {
  const navigate = useHistory();
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);

  // State za korisničke podatke (barem sliku i id)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Učitaj korisnički ID iz tokena ili localStorage (preporučljivo)
  const storedUser = JSON.parse(localStorage.getItem("DRS_user") || "{}");
  const userId = storedUser?.sub || null;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("DRS_user_token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user for dropdown:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("DRS_user");
    localStorage.removeItem("DRS_user_token");
    navigate.push("/");
  };

  if (loading) {
    return (
      <div className="text-blueGray-500 block" ref={btnDropdownRef}>
        <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
      </div>
    );
  }

  const profilePictureUrl =
    user?.account?.profile_picture_url ||
    require("assets/img/default.jpg");

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="User avatar"
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={profilePictureUrl}
            />
          </span>
        </div>
      </a>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link
          to={`/users/${userId}`}
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          View Profile
        </Link>
        <Link
          to={`/users/${userId}/edit`}
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Edit Profile
        </Link>
        <a
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </a>

        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Seprated link
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
