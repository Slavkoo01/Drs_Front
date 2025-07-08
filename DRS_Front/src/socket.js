// src/socket.js
import { io } from "socket.io-client";

// Remove trailing slash from the URL if present
const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

const socket = io(baseUrl, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
