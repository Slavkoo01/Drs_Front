import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./CardPost.js"; 

export default function PostsTable() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("DRS_user_token");
      try {
         const response = await axios.get(
          `${process.env.REACT_APP_API_URL}admin/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.post);
        setPosts(response.data.posts);
      } catch (err) {
        console.error("Error fetching posts", err);
      }
    };

    fetchPosts();
  }, []);

  const handleApprove = async (post_id) => {
    const token = localStorage.getItem("DRS_user_token");
    await axios.post(
      `${process.env.REACT_APP_API_URL}admin/posts/${post_id}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPosts((prev) => prev.filter((p) => p.post_id !== post_id));
  };

  const handleReject = async (post_id) => {
    const token = localStorage.getItem("DRS_user_token");
    await axios.post(
      `${process.env.REACT_APP_API_URL}admin/posts/${post_id}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPosts((prev) => prev.filter((p) => p.post_id !== post_id));
  };

  return (
    <div className={
        "relative flex flex-col mb-6 rounded " 
      }>
      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          username={post.username}
          profile_picture_url={post.profile_picture_url}
          post_text={post.content}
          post_image={post.image}
          onApprove={() => handleApprove(post.post_id)}
          onReject={() => handleReject(post.post_id)}
        />
      ))}
    </div>
  );
}
