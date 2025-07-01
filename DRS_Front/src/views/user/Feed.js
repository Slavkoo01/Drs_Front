import React from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import PostsTable from "components/Cards/PostsTable"; // ako se zove drugačije, ispravi


export default function Feed() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="pt-24 px-4 min-h-screen bg-blueGray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Your Posts</h2>
          <PostsTable mode="feed" /> {/* koristi /posts */}
        </div>
      </section>
      <Footer />
    </>
  );
}
