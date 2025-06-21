import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import Index from "views/Index.js";
import UserFeed from "views/user/Feed.js";
import AdminHome from "views/admin/Dashboard.js"; // <- Create this if not already

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* Routes with layouts */}
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />

      {/* Home route with role-based rendering */}
      <Route
        path="/"
        exact
        render={() => {
          const user = JSON.parse(localStorage.getItem("DRS_user"));
          
          if (!user) {
            console.log("Guest");
            return <Index />; // public homepage
            
          }

          if (user.role === "admin") {
            console.log("Admin");
            return <AdminHome />;
          }
          console.log("User");
          return <UserFeed />;
        }}
      />

      {/* Fallback redirect */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
