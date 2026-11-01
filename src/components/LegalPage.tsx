import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";

interface LegalPageProps {
  initialTab?: "privacy" | "terms";
}

const LegalPage: React.FC<LegalPageProps> = ({ initialTab = "privacy" }) => {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">(initialTab);

  return (
    <div className="min-h-screen text-slate-100 py-12 px-4 ls-fade-in">
      <SEO
        title={`${activeTab === "privacy" ? "Privacy Policy" : "Terms of Service"} — Literal Storyboard`}
        description="Legal terms, privacy policies, and OpenRouter AI disclosures for Literal Storyboard."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-cinzel tracking-wider uppercase mb-2"
          >
            ← Return to Realm
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-gold-gradient">
            {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Self-hosted privacy-first architecture and third-party AI provider disclosures. Last updated: November 1, 2026.
          </p>

          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all ${
                activeTab === "privacy"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all ${
                activeTab === "terms"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="fantasy-card rounded-2xl p-6 sm:p-10 gilded-border-glow space-y-8 leading-relaxed text-sm text-slate-300">
          {activeTab === "privacy" ? (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  1. Fully Self-Hosted Platform
                </h2>
                <p>
                  Literal Storyboard is an interactive narrative game and autonomous AI game agent.
                  The application is <strong>fully self-hosted</strong>. Your gameplay sessions, dice rolls, ally/enemy counts, character progress, and local quest logs are kept locally in your web browser and self-hosted instance.
                </p>
                <p>
                  We do not collect, monetize, sell, or distribute your personal identity, browsing history, or gameplay statistics to external data brokers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  2. AI Narrative Analysis &amp; OpenRouter Provider
                </h2>
                <p>
                  To grade dynamic player decisions against narrative NPCs in Eldoria, submitted answers are processed via language models accessed through <strong>OpenRouter</strong>.
                </p>
                <p>
                  When you submit a text response to an NPC dilemma, that snippet is sent securely to OpenRouter API endpoints for sentiment and moral alignment evaluation. Submitted responses are governed by OpenRouter's policies:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-200">
                  <li>
                    <a
                      href="https://openrouter.ai/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      OpenRouter Privacy Policy →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://openrouter.ai/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      OpenRouter Terms of Service →
                    </a>
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  3. Browser Storage
                </h2>
                <p>
                  The game uses temporary browser state to maintain active campaign positions across Eldoria. Clearing your browser cache or restarting the game resets all progress locally.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or playing Literal Storyboard, you agree to these Terms of Service. If you do not agree with these terms, please discontinue using the application.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  2. Acceptable Use
                </h2>
                <p>
                  Literal Storyboard is an interactive narrative tool. You agree not to abuse the AI evaluation endpoint by sending harmful, abusive, harassing, or illegal text prompts.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  3. OpenRouter Terms Compliance
                </h2>
                <p>
                  Use of the AI sentiment and quest evaluation is also subject to the{" "}
                  <a
                    href="https://openrouter.ai/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    OpenRouter Terms of Service
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-cinzel font-bold text-amber-300 border-b border-slate-800 pb-2">
                  4. Disclaimer of Warranties
                </h2>
                <p>
                  The service is provided "AS IS" under the MIT License without warranties of any kind. The creators and server operators assume no responsibility for uninterrupted service or story outcome persistence.
                </p>
              </section>
            </>
          )}

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="text-amber-400 hover:underline">
              ← Back to Overview
            </Link>
            <span>Realm of Eldoria</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
