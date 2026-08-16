import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// amplify_outputs.json is produced by `npx ampx sandbox` / the Amplify pipeline
// and is not committed. Loading it lazily keeps the game buildable and playable
// on a fresh clone that has never deployed a backend.
const outputs = Object.values(
  import.meta.glob("../amplify_outputs.json", { eager: true })
)[0] as { default?: Record<string, unknown> } | undefined;

if (outputs?.default) {
  Amplify.configure(outputs.default);
} else {
  console.info("amplify_outputs.json not found — skipping Amplify configuration.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
