import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import PostCard from "./CardPost_WO.js";   
import { jwtDecode } from "jwt-decode";

export default function PostsTable({ mode = "admin", func, username}) {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error,  setError]  = useState(null);
  

  // ID ulogovanog korisnika (potreban da znamo ko je vlasnik)
  const token = localStorage.getItem("DRS_user_token");
  const currentUserId = jwtDecode(token).sub

  // ─────────────────────  FETCH  ─────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      setLoad(true); setError(null);
      
      try {

         let endpoint = "";

        if (mode === "admin") {
          endpoint = `${process.env.REACT_APP_API_URL}admin/posts`;
        } else if (username) {
          endpoint = `${process.env.REACT_APP_API_URL}posts/${username}`;
        } else {
          endpoint = `${process.env.REACT_APP_API_URL}posts/friends`;
        }

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("res",username, res)

        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoad(false);
      }
    };
    fetchPosts();
  }, [mode, token]);

  // ─────────  ADMIN approve / reject  ─────────
  const handleApprove = async (pid) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}admin/posts/${pid}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.filter(p => p.post_id !== pid));
    } catch (err) {
      setError("Failed to approve post.");
    }
  };

  const handleReject = async (pid) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}admin/posts/${pid}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.filter(p => p.post_id !== pid));
    } catch (err) {
      setError("Failed to reject post.");
    }
  };

  // ─────────  DELETE (vlasnik u feed‑u)  ─────────
  const handleDelete = async (pid) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}posts/${pid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.filter(p => p.post_id !== pid));
      if(func){
        func();
      }
    } catch (err) {
      setError("Failed to delete post.");
      console.error(err);
    }
  };

  // ─────────  UPDATE (vlasnik u feed-u)  ─────────
 const handleUpdate = async (pid, Text, Image) => {
  try {
    const trimmedText = (Text || "").trim();
    const trimmedImage = (Image || "").trim();

     if (!Text && !Image) {
     await handleDelete(pid);
      return;
  }

    await axios.put(
      `${process.env.REACT_APP_API_URL}posts/${pid}`,
      {
        text: trimmedText,
        image: trimmedImage || undefined,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p.post_id === pid
          ? { ...p, post_text: trimmedText, post_image: trimmedImage }
          : p
      )
    );
  } catch (err) {
    setError("Failed to update post.");
    console.error(err);
  }
};


  // ──────────────────  UI  ──────────────────
  if (loading) return (<p className="p-4">Loading posts…</p>);
  if (error)   return (<p className="p-4 text-red-500">{error}</p>);
  if (!posts.length)
    return (
      <p className="p-4 text-blueGray-500">
        {mode === "admin" ? "No pending posts" : "No posts"}
      </p>
    );

  return (
    <div className="relative flex flex-col mb-6 rounded">
      {posts.map(post => {
        const isOwner = String(post.user_id) === String(currentUserId);
        return (
          <PostCard
            key={post.post_id}
            post_id={post.post_id}
            user_id = {post.user_id}
            username={post.username}
            profile_picture_url={post.profile_picture_url}
            post_text={mode === "admin" ? post.content : post.post_text}
            post_image={post.post_image}
            {...(mode === "admin" && {
              onApprove: () => handleApprove(post.post_id),
              onReject : () => handleReject(post.post_id),
            })}
            {...(isOwner && {
              onDelete : () => handleDelete(post.post_id),
              onEdit   : (pid,Text,Image) => handleUpdate(pid,Text,Image),

                   
            })}
          />
        );
      })}
    </div>
  );
}

PostsTable.propTypes = { mode: PropTypes.oneOf(["admin", "feed"]) };
