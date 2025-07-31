import React from "react";

interface ParkPopupProps {
  parkName: string;
  desc: string;
  isVisible: boolean;
  onClose: () => void;
}

const ParkPopup: React.FC<ParkPopupProps> = ({ parkName, desc, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative max-w-2xl w-full mx-4 rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors duration-200"
        >
          ×
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{parkName}</h2>
        </div>

        {/* Description */}
        <div className="px-6 py-4 bg-green-50">
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-gray-800">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkPopup;
