import React from "react";
import FriendSuggestions from "components/Cards/FriendSuggestions.js";
import CardFriends from "components/Cards/CardFriends.js"; 

export default function Friends() {
  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-8">
        <CardFriends color="light" />
        <div className="flex flex-wrap mt-4">
          <div className="w-full">
            <FriendSuggestions color="dark" />
          </div>
        </div>
      </div>
    </>
  );
}
