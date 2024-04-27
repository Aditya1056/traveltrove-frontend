import React from "react";

export const AuthContext = React.createContext({
    isLoggedIn: false,
    userId:null,
    userImage:null,
    token:null,
    login:() => {},
    logout:() => {},
    changeUserImage:() => {}
});