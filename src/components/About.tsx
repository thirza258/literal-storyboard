import React from 'react';
import fantasyMap from '../assets/map.svg';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
            Literal Storyboard
          </h1>

          <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-emerald-400">
              About Our Project
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Literal Storyboard is an innovative game development tool created for the AWS Game Builder Hackathon. Our project combines the power of Amazon Q's AI capabilities with the Fantasy Map Generator to create immersive and dynamic gaming experiences.
            </p>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                Key Features
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>AI-Powered Story Generation using Amazon Q</li>
                <li>Dynamic Fantasy Map Integration</li>
                <li>Interactive World Building Tools</li>
                <li>Procedural Content Generation</li>
                <li>Real-time Collaboration Capabilities</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                Technology Stack
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['React', 'TypeScript', 'Tailwind CSS', 'Amazon Q', 'AWS Services', 'Fantasy Map Generator'].map((tech) => (
                  <div key={tech} className="bg-gray-700 rounded-lg p-3 text-center">
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                Map Generation
              </h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 mb-4">
                  Our project integrates with the Fantasy Map Generator to create rich, detailed worlds for your gaming adventures. Each map is uniquely generated and can be customized to fit your story's needs.
                </p>
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={fantasyMap}
                    alt="Fantasy Map Example" 
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                Get Involved
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We're excited to be part of the AWS Game Builder community and look forward to collaborating with other developers. Whether you're a game developer, storyteller, or enthusiast, we welcome your contributions and feedback to make Literal Storyboard even better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
