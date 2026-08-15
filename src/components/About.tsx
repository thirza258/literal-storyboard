import React from 'react';
import fantasyMap from '../assets/map.svg';

const About: React.FC = () => {
  return (
    <div className="min-h-screen text-white py-16 ls-fade-in">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-yellow-500"
              style={{ fontFamily: 'Cinzel, serif' }}>
            Literal Storyboard
          </h1>

          <div className="bg-gray-800/80 rounded-lg shadow-2xl p-8 mb-8 border-4 border-yellow-700">
            <h2 className="text-4xl font-semibold mb-4 text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
              About Our Project
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Literal Storyboard is an innovative game development tool created for the AWS Game Builder Hackathon. Our project combines the power of Amazon Q's AI capabilities with the Fantasy Map Generator to create immersive and dynamic gaming experiences.
            </p>

            <div className="mb-8">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
                Key Features
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4">
                <li><span className="mr-2">🗡️</span>AI-Powered Story Generation via OpenRouter</li>
                <li><span className="mr-2">🗺️</span>Dynamic Fantasy Map Integration</li>
                <li><span className="mr-2">🏰</span>Interactive World Building Tools</li>
                <li><span className="mr-2">📜</span>Scene Backgrounds Generated per Story Beat</li>
                <li><span className="mr-2">⚔️</span>Real-time Collaboration Capabilities</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
                Technology Stack
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['React', 'TypeScript', 'Tailwind CSS', 'Amazon Q', 'AWS Services', 'Fantasy Map Generator', 'OpenRouter', 'Gemini 3 Flash', 'Nano Banana 2'].map((tech) => (
                  <div key={tech} className="bg-gray-700 rounded-lg p-3 text-center border-2 border-yellow-500">
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
                Map Generation
              </h3>
              <div className="bg-gray-700 rounded-lg p-4 border-2 border-yellow-500">
                <p className="text-gray-300 mb-4">
                  Our project integrates with the Fantasy Map Generator to create rich, detailed worlds for your gaming adventures. Each map is uniquely generated and can be customized to fit your story's needs.
                </p>
                <div className="aspect-video">
                  <img
                    src={fantasyMap}
                    alt="Fantasy Map Example"
                    className="rounded-lg object-cover w-full h-full border-4 border-yellow-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-semibold mb-4 text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
                Get Involved
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We're excited to be part of the AWS Game Builder community and look forward to collaborating with other developers. Whether you're a game developer, storyteller, or enthusiast, we welcome your contributions and feedback to make Literal Storyboard even better.
              </p>
              <p className="text-gray-300">
                Special Thanks to AWS Amplify for providing the platform to host our project. 
                Thanks to OpenRouter for routing every story and scene request to the model of our choice. 
                Thanks to Nano Banana for painting the scenes and characters. 
                Thanks to Fantasy Map Generator for providing the map generation capabilities. 
                Thanks to Amazon Q and Copilot for assist on development of the project.
              </p>
              <p className="text-gray-300 mt-4">
                Join us on this exciting journey and let's create something extraordinary together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
