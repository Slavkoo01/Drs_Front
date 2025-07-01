import React from "react";

// components

import PostsTable from "components/Cards/PostsTable";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <PostsTable color="dark" />
        </div>
      </div>
    </>
  );
}
