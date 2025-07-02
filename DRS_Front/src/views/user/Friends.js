import React, { useEffect, useState } from "react";
import FriendsNavbar from "components/Navbars/FriendsNavbar.js";
import FriendSuggestions from "components/Cards/FriendSuggestions.js";
import CardFriends from "components/Cards/CardFriends.js"; // importuj novu komponentu

export default function Friends() {
  return (
    <>
      <FriendsNavbar fixed />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <CardFriends color="light" />
        <h2 className="text-2xl font-bold mb-4 mt-12">Suggested Friends</h2>
        <div className="flex flex-wrap mt-4">
          <div className="w-full mb-12 px-4">
            <FriendSuggestions color="dark" />
          </div>
        </div>
      </div>
    </>
  );
}
