import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import ProtectedRoute from "./ProtectedRoute.js"; 

import Index from "views/Index.js";
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import User from "layouts/User.js";

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
        path="/user"
        component={User}
        allowedRoles={["user"]}
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
          return <User />;
        }}
      />

      {/* Fallback */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
