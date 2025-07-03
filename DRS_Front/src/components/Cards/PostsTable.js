import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {jwtDecode} from "jwt-decode";
import PostCard from "./CardPost_WO.js";   // prikaz pojedinačne objave

export default function PostsTable({ mode = "admin" }) {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error,  setError]  = useState(null);

  // ID ulogovanog korisnika (potreban da znamo ko je vlasnik)
  const token = localStorage.getItem("DRS_user_token");
  const currentUserId = token ? jwtDecode(token).id : null;

  // ─────────────────────  FETCH  ─────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
      setLoad(true); setError(null);
      try {
        const endpoint =
          mode === "admin"
            ? `${process.env.REACT_APP_API_URL}admin/posts`
            : `${process.env.REACT_APP_API_URL}posts`;

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    } catch (err) {
      setError("Failed to delete post.");
      console.error(err);
    }
  };

  // ─────────  UPDATE (vlasnik u feed-u)  ─────────
  const handleUpdate = async (pid, currentText, currentImage) => {
  /*  najjednostavnije: prompt() za tekst i sliku   */
  const newText  = prompt("Edit text:", currentText);
  if (newText === null) return;          // Cancel

  const newImage = prompt("Edit image URL (leave empty to keep):", currentImage || "");
  if (newImage === null) return;         // Cancel

  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}posts/${pid}`,
      { text: newText.trim(), image: newImage.trim() || undefined },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // lokalno ažuriraj state
    setPosts(prev =>
      prev.map(p =>
        p.post_id === pid ? { ...p, text: newText, image: newImage } : p
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
        const isOwner = post.user_id === currentUserId; // backend mora slati user_id
        return (
          <PostCard
            key={post.post_id}
            username={post.username}
            profile_picture_url={post.profile_picture_url}
            post_text={mode === "admin" ? post.content : post.text}
            post_image={post.image}
            {...(mode === "admin" && {
              onApprove: () => handleApprove(post.post_id),
              onReject : () => handleReject(post.post_id),
            })}
            {...(mode !== "admin" && isOwner && {
              onDelete : () => handleDelete(post.post_id),
              onEdit   : () => handleUpdate(
                      post.post_id,
                      post.text,
                      post.image
                    ),
            })}
          />
        );
      })}
    </div>
  );
}

PostsTable.propTypes = { mode: PropTypes.oneOf(["admin", "feed"]) };
