import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/AdminSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";

import Posts_Approved_List from "views/admin/Posts_Apporved_List.js";
import Posts_Pending_List from "views/admin/Posts_Pending_List.js";
import Posts_Rejected_List from "views/admin/Posts_Rejected_List.js";
import Posts_List from "views/admin/Posts_List.js";

import User_List from "views/admin/User_List.js";
import User_Add_New from "views/admin/User_Add_New.js";
import User_Pending_List from "views/admin/User_Pending_List.js";
import User_Blocked_list from "views/admin/User_Blocked_List.js";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />
        {/* Header */}
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />

            <Route path="/admin/create-user" exact component={User_Add_New} />
            <Route path="/admin/users" exact component={User_List} />
            <Route path="/admin/pending-users" exact component={User_Pending_List} />
            <Route path="/admin/blocked-users" exact component={User_Blocked_list} />
            
            <Route path="/admin/posts" exact component={Posts_List} />
            <Route path="/admin/approved-posts" exact component={Posts_Approved_List} />
            <Route path="/admin/pending-posts" exact component={Posts_Pending_List} />
            <Route path="/admin/rejected-posts" exact component={Posts_Rejected_List} />
            <Redirect from="/admin" to="/admin/dashboard" />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
