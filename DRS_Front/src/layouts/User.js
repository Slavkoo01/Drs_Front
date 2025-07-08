import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import UserNavbar from "components/Navbars/UserNavbar.js";
import Sidebar from "components/Sidebar/UserSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

import Feed from "views/user/Feed.js"
import Friends from "views/user/Friends.js"
import Friends_requests from "views/user/Requests.js"
import Profile from "../views/Profile.js"
import SearchFriends from "../views/user/SearchFriends.js"

import Footer from "components/Footers/Footer";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <UserNavbar />
        <HeaderStats />
        
        <div className="px-4 md:px-10 mb-4 mx-auto w-full -m-24">
          <Switch>
            <Route path="/user/feed" exact component={Feed} />
            <Route path="/user/friends" exact component={Friends} />
            <Route path="/user/friends_requests" exact component={Friends_requests} />
            <Route path="/user/profile/:id" exact component={Profile} />
            <Route path="/user/search_friends" exact component={SearchFriends} />

            <Redirect from="/user" to="/user/feed" />
            <Redirect from="/" to="/user/feed" />
          </Switch>
        </div>
      </div>
      <Footer showpoly={false}/>
    </>
  );
}
