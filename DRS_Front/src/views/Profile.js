import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditProfile from "../components/Forms/EditProfileForm.js";
import PostsTable from "components/Cards/PostsTable";


export default function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendStatus, setFriendStatus] = useState("none"); 
  const [busy, setBusy] = useState(false);
  const token  = localStorage.getItem("DRS_user_token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const [editingProfile, setEditingProfile] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [postNumber, setPostNumber] = useState(0);

  useEffect(() => {
  async function fetchUser() {
    setLoading(true);
    setError(null);

    try {
     ;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}users/${id}`,
        config
      );

      setUserData(response.data);
      setFriendStatus(response.data.friend_status); 
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
      setBusy(false);
    }
  }

  if (id) {
    fetchUser();
  }
}, [id]);
  
  useEffect(() => {
    if (userData?.posts_count !== undefined) {
      setPostNumber(userData.posts_count);
    }
  }, [userData]);
    const handleEditProfile = () => {
      setEditingProfile(true);
    };

  const handleRemoveFriend = async () => {
    try {
      const token = localStorage.getItem("DRS_user_token");
      await axios.delete(`${process.env.REACT_APP_API_URL}friends/${id}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setFriendStatus("none"); 
    } catch (err) {
      console.error("Failed to remove friend", err);
    }finally {
    setBusy(false);
  }
  };


const handleAddFriend = async () => {
  try {
    setBusy(true);
    const token = localStorage.getItem("DRS_user_token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}friends/${id}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    setFriendStatus("Pending");       
  } catch (err) {
    console.error("Add friend error", err);
    setFriendStatus("none");
  } finally {
    setBusy(false);
  }
};
  

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  if (!userData) return null;

  // Extracted fields
  const {
    account: { blocked, profile_picture_url, user_type, username },
    address: { city, country, street },
    contact: { email, phone },
    first_name,
    last_name,
    friend_status,
    friends_count,
    is_owner,
    posts_count
  } = userData;




  const avatar =
    profile_picture_url ||
    "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";
  const fullName = `${first_name} ${last_name}`;
  const address = [street, city, country].filter(Boolean).join(", ");

  const typeBadge = (
    <span
      className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
        user_type === "admin"
          ? "bg-yellow-500 text-white"
          : "bg-emerald-500 text-white"
      }`}
    >
      {user_type}
    </span>
  );

  const blockedBadge =
    blocked === 1 ? (
      <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-600 text-white">
        blocked
      </span>
    ) : null;
  const updatePosts = () => {
    setPostNumber(postNumber - 1)
  }
  return (
    <>
      <main className="profile-page">
        
        {/* Hero Section */}
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            
      
            <span className="w-full h-full absolute opacity-50 bg-black" />
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
          </div>
        </section>

        {/* Profile Card */}
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                {/* Top Row */}
                <div className="flex flex-wrap justify-center">
                  {/* Avatar */}
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="avatar"
                        src={avatar}
                        className="shadow-xl h-48 w-96 object-scale-down object-contain rounded-full h-[400px] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px object-cover"
                      />
                    <div className="flex items-center object-center justify-center">
                      <EditProfile 
                        isOpen={editingProfile}
                        onClose={() => setEditingProfile(false)}
                        userData={userData}
                      />
                    </div>
                    </div>
                  </div>
<div className="flex justify-center items-center">
            
            </div>
                  {/* Add Friend */}
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={
                          friendStatus === "self"
                            ? handleEditProfile
                            : friendStatus === "Accepted" || friendStatus === "pending"
                            ? handleRemoveFriend
                            : handleAddFriend
                        }

                        className={`uppercase  font-bold shadow text-xs px-4 py-2 rounded outline-none focus:outline-none
                          ${
                            friendStatus === "Accepted"
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : friendStatus === "Pending"
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                               : friendStatus === "self"
                              ? "bg-white-500 hover:bg-white-600"
                              : "bg-lightBlue-500 hover:bg-lightBlue-600 text-white"
                          }`}
                      >
                        {friendStatus === "self" && (<div><i className="fas fa-pen mr-3"></i>Edit</div>)}
                        {friendStatus === "Accepted" && "Remove Friend"}
                        {friendStatus === "Pending" && "Cancel Request"}
                        {(friendStatus === "none" || friendStatus === "Rejected") && "Add Friend +"}
                      </button>
                    </div>
                  </div>


                  {/* Stats */}
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      {[
                        { label: "Friends", value: friends_count },
                        { label: "Posts", value: postNumber },
                      ].map((x) => (
                        <div key={x.label} className="mr-4 p-3 text-center">
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {x.value}
                          </span>
                          <span className="text-sm text-blueGray-400"  >
                            {x.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
     
                {/* Name & Info */}
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold text-blueGray-700 mb-2">
                    {fullName}
                    {typeBadge}
                    {blockedBadge}
                  </h3>
                  {address && (
                    <div className="text-sm leading-normal text-blueGray-400 font-bold uppercase mb-2">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400" />
                      {address}
                    </div>
                  )}
                  {email && (
                    <div className="mb-2 text-blueGray-600">
                      <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                      {email}
                    </div>
                  )}
                  {phone && (
                    <div className="mb-2 text-blueGray-600">
                      <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>
                      {phone}
                    </div>
                  )}
                </div>

                {/* Bottom Button */}
                <div className="mt-10 py-10 border-t border-blueGray-200 ">
                  <div className="flex flex-wrap justify-center">
                    {!showPosts && (
                      <div className="w-full lg:w-9/12 px-4 text-center" >
                      <button
                        onClick={() => (setShowPosts(true))}
                        className="font-normal text-lightBlue-500"
                      >
                        Show posts
                      </button>
                    </div>)}
                      
                    {showPosts && (
                      
                        
                      <div className="w-full lg:w-9/12 px-4  ">
                        
                        <PostsTable 
                        mode="feed" 
                        func={() => updatePosts()}
                        username={username}
                        />
                        <div className="flex flex-wrap justify-center">
                         <button
                        onClick={() => (setShowPosts(false))}
                        className="font-normal text-lightBlue-500"
                        >
                        Hide posts
                      </button>
                      </div>
                      </div>
                      
                      
                
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </section>
          
      </main>
    </>
  );
}
