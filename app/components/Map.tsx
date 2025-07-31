
'use client';

import {Pencil, TreePine, Egg, Bird, Info, Highlighter, PenOff, House } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  CountryInfo,
  Species,
  MarkerData,
  ParkData,
  initializeGoogleMap,
  initGoogleMapOverlay,
  initGoogleMapDraw,
  fetchSpeciesData,
  fetchMarkers,
  fetchParks,
  initializeGoogleMapPark
} from '@/app/utils/mapUtils';
import CountryPopup from '@/app/components/CountryPopup';
import StartPopup from './StartPopup';
import BirdPopup from '@/app/components/BirdPopup';
import AreaPopup from './AreaPopup';
import SourcePopup from './SourcePopup';
import ParkPopup from './ParkPopup';

const GEOJSON_URL = '/hexagons.geojson';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [countrySpecies, setCountrySpecies] = useState<Species[]>([]);
  const [markersData, setMarkersData] = useState<MarkerData[]>([]);
  const [parksData, setParksData] = useState<ParkData[]>([]);
  const [area, setArea] = useState<number>(0);
  const [birdName, setBirdName] = useState<string>('');
  const [parkName, setParkName] = useState<string>('');
  const [parkDesc, setParkDesc] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [isAreaPopupVisible, setIsAreaPopupVisible] = useState(false);
  const [isParkPopupVisible, setIsParkPopupVisible] = useState(false);
  const [isStartPopupVisible, setIsStartPopupVisible] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isBirdPopupVisible, setIsBirdPopupVisible] = useState(false);
  const [isSourcePopupVisible, setIsSourcePopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const hoverEnabledRef = useRef<boolean>(true);

  const [mapMode, setMapMode] = useState<'default' | 'overlay' | 'draw' | 'park'>('default');

  const handleCountryClick = async (countryInfo: CountryInfo) => {
    setSelectedCountry(countryInfo);
    setIsPopupVisible(true);

    if (countryInfo.iso3 && countryInfo.iso3 !== 'Unknown') {
      setIsLoading(true);
      setError(null);

      try {
        const speciesData = await fetchSpeciesData(countryInfo.iso3);
        setCountrySpecies(speciesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load species data');
        setCountrySpecies([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBirdClick = (birdName: string, desc: string) => {
    setBirdName(birdName);
    setDesc(desc);
    setIsBirdPopupVisible(true);
  };

  const handleParkClick = (parkName:string, desc: string) => {
    setParkName(parkName);
    setParkDesc(desc);
    setIsParkPopupVisible(true);
  }

  const toggleHover = () => {
    const newValue = !hoverEnabled;
    setHoverEnabled(newValue);
    hoverEnabledRef.current = newValue;
  };

  useEffect(() => {
    fetchMarkers().then(setMarkersData);
    fetchParks().then(setParksData)
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapMode === 'default' && markersData.length > 0) {
      initializeGoogleMap(mapRef, markersData, hoverEnabledRef, handleCountryClick, handleBirdClick);
    }

    else if (mapMode === 'overlay') {
      initGoogleMapOverlay(mapRef, GEOJSON_URL);
    }

    else if (mapMode === 'draw') {
      initGoogleMapDraw(mapRef, (calculatedArea) => {
        setArea(calculatedArea);
        if (calculatedArea > 0) {
          setIsAreaPopupVisible(true); // Auto-show popup when area is calculated
        }
      });
    }
    else if (mapMode === 'park') {
      initializeGoogleMapPark(mapRef, parksData, handleParkClick);
    }

  }, [mapMode, markersData, parksData]);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute top-4 left-4 z-10 bg-green-100 p-4 rounded-xl shadow space-y-3 flex flex-col items-center">
      <button
        onClick={() => setIsStartPopupVisible(true)}
        className="text-6xl cursor-pointer text-blue-600 hover:text-blue-700 transition-colors"
        title="Info"
      >
        <Egg size={30}/>
      </button>

      <button
        onClick={toggleHover}
        className={`text-6xl cursor-pointer transition-colors ${
          hoverEnabled
            ? 'text-blue-600 hover:text-blue-700'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        title={hoverEnabled ? "Disable Hover" : "Enable Hover"}
      >
        {hoverEnabled ? <Highlighter size={30}/> : <PenOff size={30}/>}
      </button>

      <button
        onClick={() => setIsSourcePopupVisible(true)}
        className="text-6xl cursor-pointer text-blue-600 hover:text-blue-700 transition-colors"
        title="Sources"
      >
        <Info size={30}/>
      </button>

      </div>
      <div className="absolute top-44 left-4 z-10 bg-green-100 p-4 rounded-xl shadow space-y-3 flex flex-col items-center">
        <button
          onClick={() => setMapMode('default')}
          className={`text-8xl cursor-pointer transition-colors ${
            mapMode === 'default'
              ? 'text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
          title="Default Map"
        >
          <Bird size={30}/>
        </button>

        <button
          onClick={() => setMapMode('overlay')}
          className={`text-6xl cursor-pointer transition-colors ${
            mapMode === 'overlay'
              ? 'text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
          title="Overlay Map"
        >
          <TreePine size={30}/>
        </button>

        <button
          onClick={() => setMapMode('draw')}
          className={`text-8xl cursor-pointer transition-colors ${
            mapMode === 'draw'
              ? 'text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
          title="Draw Map"
        >
          <Pencil size={30}/>
        </button>

        <button
          onClick={() => setMapMode('park')}
          className={`text-8xl cursor-pointer transition-colors ${
            mapMode === 'park'
              ? 'text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
          title="Park Map"
        >
          <House size={30}/>
        </button>
      </div>




      {mapMode === 'overlay' && (
        <div className="absolute top-4 left-25 z-10 bg-green-100 p-4 rounded-lg shadow-lg space-y-1 text-sm">
          <div className="font-semibold">Avian Forest Habitat Loss (2001–2024)</div>
          <div className="text-xs text-gray-500 mb-2">Darker shades indicate more severe loss</div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: '#cc0044' }}></span> Highest loss
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: '#ff3366' }}></span> High loss
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: '#ff6699' }}></span> Moderate loss
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: '#ff99bb' }}></span> Low loss
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: '#ffd6e7' }}></span> Lowest loss (but still non-zero)
          </div>
        </div>
      )}


      <StartPopup
        isVisible={isStartPopupVisible}
        onClose={() => setIsStartPopupVisible(false)}
      />

      <SourcePopup
        isVisible={isSourcePopupVisible}
        onClose={() => setIsSourcePopupVisible(false)}
      />

      <ParkPopup
        parkName= {parkName}
        desc={parkDesc}
        isVisible={isParkPopupVisible}
        onClose={() => setIsParkPopupVisible(false)}
      />

      <CountryPopup
        isVisible={isPopupVisible}
        selectedCountry={selectedCountry}
        countrySpecies={countrySpecies}
        isLoading={isLoading}
        error={error}
        onClose={() => setIsPopupVisible(false)}
      />

      <BirdPopup
        birdName = {birdName}
        desc = {desc}
        isVisible={isBirdPopupVisible}
        onClose={() => setIsBirdPopupVisible(false)}
      />

      <AreaPopup
        isVisible={isAreaPopupVisible}
        area={area}
        onClose={() => setIsAreaPopupVisible(false)}
      />


    </div>
    
  );
};

export default Map;
