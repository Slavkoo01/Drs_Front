import React from "react";

// components

import CardTableUsers from "components/Cards/CardTableUsers";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTableUsers color="dark" />
        </div>
      </div>
    </>
  );
}
