import React from "react";
import { Link } from "react-router-dom";
import fantasyMap from "../assets/map.svg";
import SEO from "./SEO";

const About: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 py-12 px-4 ls-fade-in">
      <SEO
        title="About Literal Storyboard — AI Fantasy Game Agent & Architecture"
        description="Learn about the origins, architecture, and technology behind Literal Storyboard: an AI game development tool built for the AWS Game Builder Hackathon."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-cinzel tracking-wider uppercase mb-2"
          >
            ← Return to Realm Overview
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold font-cinzel text-gold-gradient">
            Literal Storyboard
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Autonomous AI Game Agent & Interactive Fantasy Storyboarding Tool for the AWS Game Builder Hackathon.
          </p>
        </div>

        {/* Main Card */}
        <div className="fantasy-card rounded-2xl p-6 sm:p-10 gilded-border-glow space-y-8">
          
          {/* About Section */}
          <section className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-300 flex items-center gap-2">
              <span>🏰</span> About Our Project
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Literal Storyboard is an innovative game development tool created for the <strong>AWS Game Builder Hackathon</strong>. Our project combines AI storytelling with the Fantasy Map Generator to create immersive, dynamic gaming experiences. Every model call routes through <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">OpenRouter</a>, allowing story beats, sentiment arbitration, and scene paintings to be customized with any AI model on the platform without altering core game code.
            </p>
          </section>

          {/* Key Features */}
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-300 flex items-center gap-2">
              <span>⚔️</span> Key Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "🗡️", title: "AI Storytelling", desc: "A fresh narrative dilemma and reactive dialogue for every city you land on." },
                { icon: "🎨", title: "Generated Scenery", desc: "Dynamic 16:9 scene backgrounds painted in real time via Gemini image models." },
                { icon: "⚖️", title: "Sentiment Game Mechanic", desc: "AI arbiter grades the moral tone of replies — kind answers win allies, harsh words breed enemies." },
                { icon: "🗺️", title: "Procedural Snake-and-Ladder Map", desc: "Roll the dice and watch your party travel city by city across a generated fantasy map." },
                { icon: "🛡️", title: "Offline Fallback Ready", desc: "Zero API key required to play immediately with high-resolution bundled art and lore." },
                { icon: "🌐", title: "Pluggable AI Architecture", desc: "Swap LLMs and image models with one line of code in models.ts." },
              ].map((feat) => (
                <div key={feat.title} className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-white font-cinzel">
                    <span>{feat.icon}</span>
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-xs text-slate-300">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Stack */}
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-300 flex items-center gap-2">
              <span>🛠️</span> Technology Stack
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'React 19 + TypeScript',
                'Tailwind CSS 4',
                'Vite 8',
                'AWS Amplify',
                'OpenRouter Multi-Model',
                'Gemini 3.7 Flash',
                'Gemini 3.1 Flash Lite Image',
                'Fantasy Map Generator',
                'JSON Schema Validation',
              ].map((tech) => (
                <div
                  key={tech}
                  className="bg-slate-950/80 rounded-xl p-3 text-center border border-amber-500/30 text-xs font-semibold text-amber-200"
                >
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* Map Generation */}
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-300 flex items-center gap-2">
              <span>🗺️</span> Procedural Cartography
            </h3>
            <div className="bg-slate-950/80 rounded-xl p-4 sm:p-5 border border-amber-500/30 space-y-4">
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Our project integrates with the Fantasy Map Generator to create rich, detailed worlds for your gaming adventures. Cities are laid out along a winding route across the map, and their positions are stored as fractions of the map so the board survives window resizes flawlessly.
              </p>
              <div className="aspect-video rounded-lg overflow-hidden border border-amber-500/40">
                <img
                  src={fantasyMap}
                  alt="Fantasy Map Example"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Acknowledgements */}
          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xl font-bold font-cinzel text-amber-300 flex items-center gap-2">
              <span>🤝</span> Special Acknowledgements
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Special thanks to AWS Amplify for providing hosting, OpenRouter for fast model inference, Nano Banana & Google Gemini for story generation and scene painting, and the AWS Game Builder Hackathon community.
            </p>
          </section>

          {/* Back to Home CTA */}
          <div className="text-center pt-4">
            <Link
              to="/"
              className="inline-block px-8 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 text-sm transition-all"
            >
              Return to Adventure
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
