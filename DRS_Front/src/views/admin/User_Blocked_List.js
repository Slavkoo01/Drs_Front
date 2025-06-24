import React from "react";

// components

import CardTableUsersBlocked from "components/Cards/CardTableUsersBlocked.js";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTableUsersBlocked color="dark" />
        </div>
      </div>
    </>
  );
}
