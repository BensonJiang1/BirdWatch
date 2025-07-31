import React from 'react';

interface BirdPopupProps {
  birdName: string;
  desc: string;
  isVisible: boolean;
  onClose: () => void;
}

const StartPopup: React.FC<BirdPopupProps> = ({ birdName, desc, isVisible, onClose }) => {
  if (!isVisible) return null;

  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(birdName.replace(/\s+/g, '_'))}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative max-w-xl w-full mx-4 rounded-xl overflow-hidden shadow-lg bg-green-100">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-green-600 bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col gap-6 min-h-[300px] justify-between">
          {/* Top-left bird name */}
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-800">{birdName}</h2>
          </div>

          {/* Centered description */}
          <div className="flex-grow flex items-center justify-start">
            <p className="text-gray-700 text-lg text-center max-w-prose">{desc}</p>
          </div>

          {/* Bottom button */}
          <div className="text-center mt-4">
            <a 
              href={wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              View on Wikipedia
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPopup;
