import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "components/Cards/CardPost_WO";
import UserNavbar from "components/Navbars/UserNavbar.js";

export default function FriendPosts() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("DRS_user_token");
        
        if (!token) {
          setError("You must be logged in to view posts.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}posts/${username}`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", response.data); // Debug log
        
        setPosts(response.data.posts || []);
        setUserInfo(response.data.user_info || null);
        setError("");
        
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
        
        if (err.response?.status === 404) {
          setError(`User '${username}' not found.`);
        } else if (err.response?.status === 401) {
          setError("You are not authorized to view these posts.");
        } else {
          setError("Could not load posts for this user.");
        }
        
        setPosts([]);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
          <UserNavbar fixed />
          <section className="pt-24 px-4 min-h-screen bg-blueGray-50">
    <div className="p-4 max-w-4xl mx-auto">
      {userInfo && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Posts by {userInfo.first_name} {userInfo.last_name}
          </h2>
          <p className="text-gray-600">@{username}</p>
          <div className="mt-2 text-sm text-gray-500">
            Total posts: {posts.length}
          </div>
        </div>
      )}
      
      {posts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">
            {userInfo ? 
              `${userInfo.first_name} has no posts yet.` : 
              "This user has no posts yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.post_id}
              username={post.username}
              profile_picture_url={post.profile_picture_url}
              post_text={post.text}
              post_image={post.image}
              post_id={post.post_id}
              status={post.status}
            />
          ))}
        </div>
      )}
    </div>
    </section>
    </>
  );
}