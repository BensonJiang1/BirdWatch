import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '../lib/supabase';


export interface CountryInfo {
  name: string;
  continent: string;
  region: string;
  population: string;
  economy: string;
  incomeGroup: string;
  iso3: string;
  area: string;
}

export interface Species {
  id: number;
  Species: string;
  Country: string;
  ISO_Code: string;
}

export interface MarkerData {
  lat: number;
  lng: number;
  image_url: string;
  Species: string;
  desc: string;
}

export interface ParkData {
  park_name: string;
  lat: number;
  lng: number;
  image_url: string;
  description: string;
}


// Function to get country information
export const getCountryInfo = (feature: any): CountryInfo => {
  const name = feature.getProperty('NAME') || 
              feature.getProperty('name') || 
              feature.getProperty('NAME_EN') || 
              'Unknown Country';
  
  const nameEn = feature.getProperty('NAME_EN') || name;
  const continent = feature.getProperty('CONTINENT') || 'Unknown';
  const region = feature.getProperty('REGION_UN') || feature.getProperty('SUBREGION') || 'Unknown';
  const population = feature.getProperty('POP_EST') || 'Unknown';
  const economy = feature.getProperty('ECONOMY') || 'Unknown';
  const incomeGroup = feature.getProperty('INCOME_GRP') || 'Unknown';
  const iso3 = feature.getProperty('ISO_A3') || 'Unknown';
  const area = feature.getProperty('AREA_KM2') || 'Unknown';

  return {
    name: String(nameEn),
    continent: String(continent),
    region: String(region),
    population: population !== 'Unknown' ? Number(population).toLocaleString() : 'Unknown',
    economy: String(economy),
    incomeGroup: String(incomeGroup),
    iso3: String(iso3),
    area: area !== 'Unknown' ? Number(area).toLocaleString() + ' km²' : 'Unknown'
  };
};

// Function to fetch species data from Supabase
export const fetchSpeciesData = async (isoCode: string): Promise<Species[]> => {
  try {
    const { data, error } = await supabase
      .from('endangered_species')
      .select('id, Species, Country, ISO_Code')
      .eq('ISO_Code', isoCode);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching species data:', err);
    throw new Error('Failed to load species data');
  }
};

export const fetchMarkers = async (): Promise<MarkerData[]> => {
  try{
    const { data, error } = await supabase
      .from('endangered_species')
      .select('lat, lng, image_url, Species, desc')

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching marker data:', err);
    throw new Error('Failed to load marker data');
  }
};

export const fetchParks = async (): Promise<ParkData[]> => {
  try{
    const { data, error } = await supabase
      .from('parks')
      .select('park_name, lat, lng, image_url, description')

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching marker data:', err);
    throw new Error('Failed to load marker data');
  }
}


let loader: Loader | null = null;

export const getGoogleMapsLoader = () => {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['marker'],
    });
  }
  return loader;
};


// Initialize Google Map
export const initializeGoogleMap = async (
  mapRef: React.RefObject<HTMLDivElement | null>,
  markersData: MarkerData[],
  hoverEnabledRef: React.RefObject<boolean>,
  onCountryClick: (countryInfo: CountryInfo) => void,
  onBirdClick: (birdName: string, desc: string) => void
) => {
  const loader = getGoogleMapsLoader();

  try {
    const { Map } = await loader.importLibrary('maps');
    const { AdvancedMarkerElement } = await loader.importLibrary('marker');
    
    if (!mapRef.current) return;

    const map = new Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4,
      mapId: process.env.NEXT_PUBLIC_GOOGLEMAPS_MAP_ID,
      minZoom: 2,
      maxZoom: 18,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
      mapTypeControl: false,      
      zoomControl: false,         // optional, if you want to remove zoom +/- buttons
      rotateControl: false,       // optional, for rotating maps
      scaleControl: false,  
      streetViewControl: false,    // This removes the Street View pegman
      fullscreenControl: false, 
    });


    // Set your minimum zoom level here
    const MIN_ZOOM_FOR_MARKERS = 6;

    markersData.forEach(({ lat, lng, image_url, Species, desc}) => {
      // Create container for the marker
      const markerContainer = document.createElement('div');
      markerContainer.style.position = 'relative';
      markerContainer.style.cursor = 'pointer';
      markerContainer.style.display = 'flex';
      markerContainer.style.flexDirection = 'column';
      markerContainer.style.alignItems = 'center';
      
      // Create the image element
      const img = document.createElement('img');
      img.src = image_url;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.borderRadius = '50%';
      img.style.border = '2px solid white';
      img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      img.style.backgroundColor = 'white';
      
      // Create the pointer element
      const pointer = document.createElement('div');
      pointer.style.width = '0';
      pointer.style.height = '0';
      pointer.style.borderLeft = '8px solid transparent';
      pointer.style.borderRight = '8px solid transparent';
      pointer.style.borderTop = '12px solid white';
      pointer.style.marginTop = '-1px'; // Slight overlap to connect with image
      pointer.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))';
      
      // Add elements to container
      markerContainer.appendChild(img);
      markerContainer.appendChild(pointer);

      const marker = new AdvancedMarkerElement({
        map,
        position: { lat, lng },
        title: Species,
        content: markerContainer,
      });

      marker.addListener('click', () => {
        console.log(Species);
        onBirdClick(Species, desc);
      });

      // Function to show/hide markers based on zoom
      const updateMarkerVisibility = () => {
        const currentZoom = map.getZoom() || 4;
        if (currentZoom >= MIN_ZOOM_FOR_MARKERS) {
          marker.map = map;  // Show marker
        } else {
          marker.map = null; // Hide marker
        }
      };

      // Initial visibility check
      updateMarkerVisibility();

      // Update visibility when zoom changes
      map.addListener('zoom_changed', updateMarkerVisibility);
    });

    let infoWindow: google.maps.InfoWindow;
    
    map.data.setStyle({
      fillColor: 'transparent',
      strokeColor: '#666',
      strokeWeight: 1,
      fillOpacity: 0,
    });

    // Mouseover event
    map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
      if (!hoverEnabledRef.current) return;
      
      const name = event.feature.getProperty('NAME') || 
                  event.feature.getProperty('name') || 
                  event.feature.getProperty('NAME_EN') ||
                  'Unknown Region';
      
      const nameStr = String(name);
      
      if (!nameStr || nameStr.trim() === '' || 
          nameStr.toLowerCase().includes('antarctica') ||
          nameStr.toLowerCase().includes('antarctic')) {
        return;
      }

      map.data.overrideStyle(event.feature, {
        fillColor: "#ffe066",
        fillOpacity: 0.3,
        strokeColor: "#ffe066",
        strokeWeight: 2,
      });
    });

    // Mouseout event
    map.data.addListener('mouseout', (event: google.maps.Data.MouseEvent) => {
      if (!hoverEnabledRef.current) return;
      
      const name = event.feature.getProperty('NAME') || 
                  event.feature.getProperty('name') || 
                  event.feature.getProperty('NAME_EN') ||
                  'Unknown Region';
      
      const nameStr = String(name);
      
      if (!nameStr || nameStr.trim() === '' || 
          nameStr.toLowerCase().includes('antarctica') ||
          nameStr.toLowerCase().includes('antarctic')) {
        return;
      }

      map.data.revertStyle(event.feature);
    });

    // Click event
    map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const name = event.feature.getProperty('NAME') || 
                  event.feature.getProperty('name') || 
                  event.feature.getProperty('NAME_EN') ||
                  'Unknown Region';
      
      const nameStr = String(name);
      
      // Skip if no valid name or unwanted regions
      if (!nameStr || nameStr.trim() === '' || 
          nameStr.toLowerCase().includes('antarctica') ||
          nameStr.toLowerCase().includes('antarctic')) {
        return;
      }

      // Get country information and trigger callback
      const countryInfo = getCountryInfo(event.feature);
      onCountryClick(countryInfo);
      
      // Close the hover info window if it's open
      if (infoWindow) {
        infoWindow.close();
      }
    });

    // Load the GeoJSON data
    map.data.loadGeoJson('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson', {}, (features) => {
      features.forEach((feature) => {
        const name = feature.getProperty('NAME') || 
                    feature.getProperty('name') || 
                    feature.getProperty('NAME_EN') || '';
        
        const nameStr = String(name);
        
        if (nameStr.toLowerCase().includes('antarctica') || 
            nameStr.toLowerCase().includes('antarctic') ||
            !nameStr || 
            nameStr.trim() === '') {
          map.data.remove(feature);
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading Google Maps:', error);
  }
};


export const initGoogleMapOverlay = async (
  mapRef: React.RefObject<HTMLDivElement | null>,
  geojsonUrl: string
) => {
  const loader = getGoogleMapsLoader();

  try {
    const { Map } = await loader.importLibrary('maps');

    if (!mapRef.current) return;

    const map = new Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4,
      minZoom: 2,
      maxZoom: 18,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
      mapTypeControl: false,
      zoomControl: false,         // optional, if you want to remove zoom +/- buttons
      rotateControl: false,       // optional, for rotating maps
      scaleControl: false,  
      streetViewControl: false,    // This removes the Street View pegman
      fullscreenControl: false, 
    });

    map.data.loadGeoJson(geojsonUrl, {}, (features) => {
      features.forEach((feature) => {
        const fillColorRaw = feature.getProperty('fill');
        const fillOpacityRaw = feature.getProperty('fill_opacity');
    
        const fillColor: string = typeof fillColorRaw === 'string' ? fillColorRaw : '#ffffff';
        const fillOpacity: number = typeof fillOpacityRaw === 'number' ? fillOpacityRaw : 0.5;
    
        map.data.overrideStyle(feature, {
          fillColor,
          fillOpacity,
          strokeColor: '#555',
          strokeWeight: 1,
        });
      });
    });
    

  } catch (error) {
    console.error('Error loading Google Maps Overlay:', error);
  }
};

export const initGoogleMapDraw = async (
  mapRef: React.RefObject<HTMLDivElement | null>,
  onPolygonComplete: (area: number) => void
) => {
  const loader = getGoogleMapsLoader();

  try {
    const { Map } = await loader.importLibrary('maps');
    const { DrawingManager } = await loader.importLibrary('drawing');
    
    if (!mapRef.current) return;

    const map = new Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4,
      minZoom: 2,
      maxZoom: 18,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
      mapTypeControl: false,
      zoomControl: false,
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,    // This removes the Street View pegman
      fullscreenControl: false, 
      
    });

    // Initialize drawing manager
    const drawingManager = new DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {
        fillColor: '#4CAF50',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#2E7D32',
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);

    // Function to calculate polygon area in square kilometers
    const calculatePolygonArea = (polygon: google.maps.Polygon): number => {
      const path = polygon.getPath();
      const area = google.maps.geometry.spherical.computeArea(path);
      // Convert from square meters to square kilometers
      return area / 1000000;
    };

    // Store drawn polygons for cleanup
    const drawnPolygons: google.maps.Polygon[] = [];

    // Handle polygon completion
    drawingManager.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
      // Calculate and report area
      const area = calculatePolygonArea(polygon);
      onPolygonComplete(area);

      // Store the polygon
      drawnPolygons.push(polygon);

      // Add listeners for when the polygon is edited
      const path = polygon.getPath();
      
      path.addListener('set_at', () => {
        const newArea = calculatePolygonArea(polygon);
        onPolygonComplete(newArea);
      });

      path.addListener('insert_at', () => {
        const newArea = calculatePolygonArea(polygon);
        onPolygonComplete(newArea);
      });

      path.addListener('remove_at', () => {
        const newArea = calculatePolygonArea(polygon);
        onPolygonComplete(newArea);
      });

      // Optional: Disable drawing mode after completing a polygon
      // drawingManager.setDrawingMode(null);

      // Add a delete functionality on right-click
      polygon.addListener('rightclick', () => {
        polygon.setMap(null);
        const index = drawnPolygons.indexOf(polygon);
        if (index > -1) {
          drawnPolygons.splice(index, 1);
        }
        // Reset area callback when polygon is deleted
        // onPolygonComplete(0);
      });
    });

    // Optional: Clear all polygons function 
    const clearAllPolygons = () => {
      drawnPolygons.forEach(polygon => {
        polygon.setMap(null);
      });
      drawnPolygons.length = 0;
      onPolygonComplete(0);
    };

    // Store the clear function on the map for external access if needed
    (map as any).clearDrawnPolygons = clearAllPolygons;

    return map;
    
  } catch (error) {
    console.error('Error loading Google Maps Drawing tools:', error);
  }
};


export const initializeGoogleMapPark = async (
  mapRef: React.RefObject<HTMLDivElement | null>,
  parksData: ParkData[],
  onParkClick: (birdName: string, desc: string) => void
) => {
  const loader = getGoogleMapsLoader();

  try {
    const { Map } = await loader.importLibrary('maps');
    const { AdvancedMarkerElement } = await loader.importLibrary('marker');
    
    if (!mapRef.current) return;

    const map = new Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4,
      mapId: process.env.NEXT_PUBLIC_GOOGLEMAPS_MAP_ID,
      minZoom: 2,
      maxZoom: 18,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
      mapTypeControl: false,      
      zoomControl: false,         // optional, if you want to remove zoom +/- buttons
      rotateControl: false,       // optional, for rotating maps
      scaleControl: false,  
      streetViewControl: false,    
      fullscreenControl: false, 
    });

    map.data.setStyle({
      fillColor: 'transparent',
      strokeColor: '#666',
      strokeWeight: 1,
      fillOpacity: 0,
    });

    parksData.forEach(({ park_name, lat, lng, image_url, description }) => {
      // Create container for the marker
      const markerContainer = document.createElement('div');
      markerContainer.style.position = 'relative';
      markerContainer.style.cursor = 'pointer';
      markerContainer.style.display = 'flex';
      markerContainer.style.flexDirection = 'column';
      markerContainer.style.alignItems = 'center';
    
      // Create the image element
      const img = document.createElement('img');
      img.src = image_url;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.borderRadius = '50%';
      img.style.border = '2px solid white';
      img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      img.style.backgroundColor = 'white';
    
      // Create the pointer element
      const pointer = document.createElement('div');
      pointer.style.width = '0';
      pointer.style.height = '0';
      pointer.style.borderLeft = '8px solid transparent';
      pointer.style.borderRight = '8px solid transparent';
      pointer.style.borderTop = '12px solid white';
      pointer.style.marginTop = '-1px';
      pointer.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))';
    
      // Add elements to container
      markerContainer.appendChild(img);
      markerContainer.appendChild(pointer);
    
      // Create the marker
      const marker = new AdvancedMarkerElement({
        map,
        position: { lat, lng },
        title: park_name,
        content: markerContainer,
      });
    
      // Add click listener
      marker.addListener('click', () => {
        console.log(park_name);
        onParkClick(park_name, description);
      });
    });


    // Load the GeoJSON data
    map.data.loadGeoJson('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson', {}, (features) => {
      features.forEach((feature) => {
        const name = feature.getProperty('NAME') || 
                    feature.getProperty('name') || 
                    feature.getProperty('NAME_EN') || '';
        
        const nameStr = String(name);
        
        if (nameStr.toLowerCase().includes('antarctica') || 
            nameStr.toLowerCase().includes('antarctic') ||
            !nameStr || 
            nameStr.trim() === '') {
          map.data.remove(feature);
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading Google Maps:', error);
  }
};
