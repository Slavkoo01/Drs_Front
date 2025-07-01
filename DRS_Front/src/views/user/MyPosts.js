import React, { useState, useRef } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import PostsTable from "components/Cards/PostsTable";
import CreatePostForm from "components/Forms/CreatePostForm"; // importuj formu

export default function Feed() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const postsTableRef = useRef();

  const handlePostCreated = () => {
    setShowCreateForm(false);
    // Opcionalno: Ako PostsTable ima neku metodu za refresh, pozovi je
    // ili uradi nešto da se feed osveži (možeš da koristiš key ili neki reload trigger)
    // Ovde primer ako PostsTable nema refresh, možeš ponovo renderovati sa nekim triggerom
  };

  return (
    <>
      <IndexNavbar fixed />
      <section className="pt-24 px-4 min-h-screen bg-blueGray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Posts</h2>
            <button
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              {showCreateForm ? "Wow, you are making a new post!" : "Create New Post"}
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6">
              <CreatePostForm
                onPostCreated={handlePostCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          <PostsTable mode="feed" />
        </div>
      </section>
      <Footer />
    </>
  );
}
