// src/components/AvatarActionDropdown.js
import React, { useState, useRef } from "react";
import { createPopper } from "@popperjs/core";
import PropTypes from "prop-types";

export default function AvatarActionDropdown({
  onEdit,
  onDelete,
}) {
  /* popper state */
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popperRef = useRef(null);

  const toggle = () => {
    if (!open) {
      createPopper(triggerRef.current, popperRef.current, {
        placement: "bottom-end",
      });
    }
    setOpen(!open);
  };

  /* helper to close then run cb */
  const run = (cb) => () => {
    setOpen(false);
    cb && cb();
  };

  return (
    <>
      {/* avatar trigger */}
      <button
        ref={triggerRef}
        onClick={toggle}
        className="w-10 h-10 rounded-full overflow-hidden focus:outline-none"
      >
        <i className="fas fa-ellipsis-h"></i>
      </button>

      {/* popper */}
      <div
        ref={popperRef}
        className={`${
          open ? "block" : "hidden"
        } bg-white rounded shadow-lg  py-2 mt-1 z-50 min-w-[8rem]`}
      >
        <button
          onClick={run(onEdit)}
          className="block w-full text-left px-4 py-2 hover:text-lightBlue-600"
        >
           <i className="fas fa-pen mr-3"></i>
          Edit
        </button>
        <button
          onClick={run(onDelete)}
          className="block w-full text-left px-4 py-2 hover:text-lightBlue-600"
        >
          <i className="fas fa-trash mr-3"></i>
          Delete
        </button>
      </div>
    </>
  );
}

AvatarActionDropdown.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
