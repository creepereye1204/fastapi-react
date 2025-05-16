import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Workshop from "./pages/Workshop";
import { ClientSideIDTokenFlow, AuthorizationCodeFlow } from "./pages/Login";
import Video from "./pages/Video";
import React from "react";

const Main = (): React.ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Video />} />
        <Route path="/:userId" element={<Workshop />} />
        <Route path="/:userId/" element={<Workshop />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
