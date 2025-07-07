import React from "react";
import PostsTable from "components/Cards/PostsTable";
import CreatePostForm from "components/Forms/CreatePostForm"; // importuj formu

export default function Feed() {

  return (
    <>
      <section className="pt-24 px-4 min-h-screen bg-blueGray-50 mt-3" >
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Feed</h2>
          </div>

          <CreatePostForm/>

          <PostsTable mode="feed" />
        </div>
      </section>
    </>
  );
}
