import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import KideraToyQuiz from "./KideraToyQuiz.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KideraToyQuiz />
    <Analytics />
  </React.StrictMode>
);
