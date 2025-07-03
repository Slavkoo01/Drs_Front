import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import UserProfile from "views/user/UserProfile.js";
import EditProfile from "views/user/EditProfile.js";
import Index from "views/Index.js";
import UserFeed from "views/user/Feed.js";
import Friends from "views/user/Friends.js";
import ProtectedRoute from "./ProtectedRoute.js"; 
import Requests from "views/user/Requests.js";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* Authenticated admin routes */}
      <ProtectedRoute
        path="/admin"
        component={Admin}
        allowedRoles={["admin"]}
      />

      <ProtectedRoute
        exact
        path="/friends"
        component={Friends}
        allowedRoles={["user"]}
      />

      <ProtectedRoute
        path="/friends/requests"
        component={Requests}
        allowedRoles={["user"]}
      />

      <ProtectedRoute
        path="/users/:id/edit"
        component={EditProfile}
        allowedRoles={["user", "admin"]}
      />

      <ProtectedRoute
        path="/users/:id"
        component={UserProfile}
        allowedRoles={["user", "admin"]}
      />

      {/* Public auth routes */}
      <Route path="/auth" component={Auth} />

      {/* Home route logic */}
      <Route
        path="/"
        exact
        render={() => {
          const user = JSON.parse(localStorage.getItem("DRS_user"));

          if (!user) return <Index />;
          if (user.role === "admin") return <Redirect to="/admin/dashboard" />;
          return <UserFeed />;
        }}
      />

      {/* Fallback */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
