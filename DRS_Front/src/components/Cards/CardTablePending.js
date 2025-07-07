import React, { useEffect, useState } from "react";
import axios from "axios";
import CardPost from "./CardPost.js";

export default function PostsTable({ adminView = true }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("DRS_user_token");
      setLoading(true);
      setError(null);
      
      try {
        const endpoint = adminView
          ? `${process.env.REACT_APP_API_URL}admin/posts/pending`
          : `${process.env.REACT_APP_API_URL}posts`;
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Res: ", response.data)
        setPosts(response.data.pending_posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [adminView]);

  const handleApprove = async (post_id) => {
    console.log("LOL: ", post_id)
    const token = localStorage.getItem("DRS_user_token");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}admin/posts/${post_id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts((prev) => prev.filter((p) => p.post_id !== post_id));
    } catch (err) {
      console.error("Error approving post:", err);
      setError("Failed to approve post. Please try again.");
    }
  };

  const handleReject = async (post_id) => {
    const token = localStorage.getItem("DRS_user_token");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}admin/posts/${post_id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts((prev) => prev.filter((p) => p.post_id !== post_id));
    } catch (err) {
      console.error("Error rejecting post:", err);
      setError("Failed to reject post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blueGray-700"></div>
        <span className="ml-2 text-blueGray-600">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-2">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-blueGray-500 text-lg">
          {adminView ? "No pending posts to review" : "No posts available"}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col mb-6 rounded">
    {posts.map((post) => (
      <CardPost
        id = {post.post_id}
        username={post.username}
        post_text={post.content}
        profile_picture_url={post.profile_picture_url}
        post_image={post.image}
          onApprove={() => handleApprove(post.post_id)}
        onReject={() => handleReject(post.post_id)}
      />

    ))}
  </div>
  );
}