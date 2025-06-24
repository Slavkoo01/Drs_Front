import React from "react";

// components

import CardTableUsersPending from "components/Cards/CardTableUsersPending.js";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTableUsersPending color="dark" />
        </div>
      </div>
    </>
  );
}
