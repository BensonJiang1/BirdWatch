import React from 'react';
import { CountryInfo, Species} from '@/app/utils/mapUtils';

interface CountryPopupProps {
  isVisible: boolean;
  selectedCountry: CountryInfo | null;
  countrySpecies: Species[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const CountryPopup: React.FC<CountryPopupProps> = ({
  isVisible,
  selectedCountry,
  countrySpecies,
  isLoading,
  error,
  onClose
}) => {
  if (!isVisible || !selectedCountry) return null;

  return (
    <div className="absolute top-4 left-4 bg-green-100 rounded-lg shadow-lg p-4 max-w-md z-10 border max-h-96 overflow-y-auto">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{selectedCountry.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none ml-2"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <div>
          <span className="font-semibold text-gray-600">ISO Code:</span>
          <span className="ml-2 text-gray-800">{selectedCountry.iso3}</span>
        </div>
        
        <div>
          <span className="font-semibold text-gray-600">Continent:</span>
          <span className="ml-2 text-gray-800">{selectedCountry.continent}</span>
        </div>
        
        <div>
          <span className="font-semibold text-gray-600">Region:</span>
          <span className="ml-2 text-gray-800">{selectedCountry.region}</span>
        </div>
      </div>

      {/* Species Section */}
      <div className="border-t pt-3">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Critically Endangered Bird Species:</h4>
        
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading species data...</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm py-2">
            {error}
          </div>
        )}

        {!isLoading && !error && countrySpecies.length === 0 && (
          <p className="text-gray-600 text-sm">No species data found for this country.</p>
        )}

        {!isLoading && !error && countrySpecies.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {countrySpecies.map((species, index) => (
              <div key={species.id || index} className="text-sm p-2 bg-green-200 rounded">
                <span className="font-medium text-gray-800 italic">{species.Species}</span>
              </div>
            ))}
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
              Total species: {countrySpecies.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryPopup;