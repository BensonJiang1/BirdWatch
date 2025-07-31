import React from 'react';

interface AreaPopupProps {
  isVisible: boolean;
  area: number;
  onClose: () => void;
}

const AreaPopup: React.FC<AreaPopupProps> = ({ isVisible, area, onClose }) => {
  if (!isVisible) return null;

  // Area calculations
  const areaInKm2 = area;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-green-100 rounded-lg shadow-xl max-w-xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-800">Area Analysis</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Main Area Display */}
            <div className="bg-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Selected Area</h3>
              <p className="text-2xl font-bold text-blue-900">
                {areaInKm2.toLocaleString()} km²
              </p>
            </div>

            {/* Bird Habitat Calculations */}
              <div className="bg-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Bird Habitat Potential</h3>
                <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                <span>Breeding bird pairs:</span>
                <span className="font-medium">{(areaInKm2 * 50).toLocaleString()} pairs*</span>
                </div>
                <div className="flex justify-between">
                <span>Migration stopover capacity:</span>
                <span className="font-medium">{(areaInKm2 * 1000).toLocaleString()} birds*</span>
                </div>
                <div className="flex justify-between">
                <span>Forest species supported:</span>
                <span className="font-medium">{Math.round(areaInKm2 * 0.3)} different species*</span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                *Estimates based on temperate forest bird densities and habitat requirements
                </p>
                </div>
              </div>


            {/* Environmental Calculations */}
            <div className="bg-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Environmental Estimates</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Approximate tree capacity:</span>
                  <span className="font-medium">{(areaInKm2 * 150000).toLocaleString()} trees*</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂ absorption potential:</span>
                  <span className="font-medium">{(areaInKm2 * 3000).toLocaleString()} tons/year*</span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  *Estimates assume forest coverage and average tree density
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AreaPopup;