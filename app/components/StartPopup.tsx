import React from 'react';
import Image from 'next/image';

interface StartPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const StartPopup: React.FC<StartPopupProps> = ({isVisible, onClose}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative max-w-xl w-full mx-4 rounded-xl overflow-hidden shadow-lg">
        {/* Close button positioned absolutely on top */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-green-600 bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
        
        {/* Image fills entire popup */}
        <Image
          src="/b.png"
          alt="BirdWatch"
          width={700}
          height={800}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default StartPopup;