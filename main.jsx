import React from "react";
import ReactDOM from "react-dom/client";
import KideraToyQuiz from "./KideraToyQuiz.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KideraToyQuiz />
  </React.StrictMode>
);

// Tell the embedding page how tall the quiz is so the iframe can grow and shrink
// with it, instead of sitting in a fixed-height box with its own inner scrollbar.
// Same message shape the card decks already use: { type: "kidera:height", height }.
(function reportHeight() {
  if (window.parent === window) return;

  var PARENTS = [
    "https://kidera.com.au",
    "https://www.kidera.com.au",
    "https://walrus-bullfrog-nmrm.squarespace.com",
  ];

  var root = document.getElementById("root");
  if (!root || typeof ResizeObserver === "undefined") return;

  // Every screen sets min-height:100vh so it fills a fixed-height frame. Once the
  // frame follows the content that floor would stop the quiz ever shrinking, so
  // drop it to a value that just keeps short screens from looking cramped.
  var style = document.createElement("style");
  style.textContent = "#root > div { min-height: 420px !important; }";
  document.head.appendChild(style);

  function post(msg) {
    for (var i = 0; i < PARENTS.length; i++) {
      try {
        window.parent.postMessage(msg, PARENTS[i]);
      } catch (e) {}
    }
  }

  var last = 0;
  function send() {
    var h = Math.ceil(root.getBoundingClientRect().height);
    if (!h || Math.abs(h - last) < 8) return;
    var jumped = Math.abs(h - last) > 120;
    last = h;
    post({ type: "kidera:height", height: h });
    // A big jump means a new screen, so let the page scroll the quiz back into
    // view rather than leaving the reader partway down it.
    if (jumped) post({ type: "kidera:screen" });
  }

  new ResizeObserver(send).observe(root);
  window.addEventListener("load", send);
  send();
})();
