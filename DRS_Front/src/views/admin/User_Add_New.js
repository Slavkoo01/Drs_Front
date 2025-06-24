import React from "react";

// components

import AdminRegister from "views/auth/AdminRegister";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <AdminRegister color="dark" />
        </div>
      </div>
    </>
  );
}
