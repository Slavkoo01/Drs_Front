import React from "react";
import CardTablePending from "components/Cards/CardTablePending.js";

export default function PostsPendingList() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTablePending adminView={true} />
        </div>
      </div>
    </>
  );
}
