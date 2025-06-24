import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = JSON.parse(localStorage.getItem("DRS_user"));

        if (!user) {
          return <Redirect to="/" />; 
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          return <Redirect to="/" />; 
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
