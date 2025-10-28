import { useEffect, useRef, useState } from "react";
import { Vehicle } from "@/services/vehicleTrackingService";

interface Driver {
  id: number;
  lat: number;
  lng: number;
  type: 'auto' | 'bike';
}

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  showRoute?: boolean;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  showDriverMarker?: boolean;
  nearbyDrivers?: Driver[];
  nearbyVehicles?: Vehicle[]; // New prop for real-time tracking
  vehicleType?: 'bike' | 'auto' | 'car'; // Filter by vehicle type
  showUserLocation?: boolean;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
}

const MapComponent = ({
  center = { lat: 17.385, lng: 78.486 }, // Hyderabad default
  zoom = 13,
  showRoute = false,
  origin,
  destination,
  driverLocation,
  showDriverMarker = false,
  nearbyDrivers = [],
  nearbyVehicles = [], // New vehicles with real-time tracking
  vehicleType, // Filter by vehicle type
  showUserLocation = true,
  onMapLoad,
  className = "w-full h-full",
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null);
  const [nearbyMarkers, setNearbyMarkers] = useState<google.maps.Marker[]>([]);
  const [vehicleMarkers, setVehicleMarkers] = useState<Map<string, google.maps.Marker>>(new Map());
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        // Check if API key is set
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        console.log('API Key check:', apiKey ? 'Found' : 'Missing');
        
        if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
          setError("Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to .env file");
          setLoading(false);
          return;
        }

        // Load Google Maps script if not already loaded
        if (!window.google?.maps) {
        console.log('Loading Google Maps script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
        script.async = true;
        script.defer = true;
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log('Google Maps script loaded successfully');
              resolve();
            };
            script.onerror = (e) => {
              console.error('Failed to load script:', e);
              reject(new Error('Failed to load Google Maps script'));
            };
            document.head.appendChild(script);
          });
          
          // Wait a bit for google.maps to be available
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (!mapRef.current) {
          console.log('Map ref not available');
          return;
        }
        
        if (!window.google?.maps) {
        console.log('Creating map instance...');
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          tilt: 45, // Enable 3D tilt
          heading: 0, // Initial heading
        });

        console.log('Map instance created:', mapInstance);
        setMap(mapInstance);
        onMapLoad?.(mapInstance);
        setLoading(false);
        console.log('Map initialization complete!');
      } catch (err) {
        console.error("Error loading Google Maps:", err);
        setError(`Failed to load Google Maps: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update map center
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  // Draw route between origin and destination
  useEffect(() => {
    if (!map || !showRoute || !origin || !destination) return;

    const drawRoute = async () => {
      try {
        const directionsService = new google.maps.DirectionsService();
        const result = await directionsService.route({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });

        // Clear existing route
        if (routePolyline) {
          routePolyline.setMap(null);
        }

        // Draw new route
        const polyline = new google.maps.Polyline({
          path: result.routes[0].overview_path,
          geodesic: true,
          strokeColor: "#2563eb",
          strokeOpacity: 0.8,
          strokeWeight: 5,
        });

        polyline.setMap(map);
        setRoutePolyline(polyline);

        // Add origin marker (pickup)
        new google.maps.Marker({
          position: origin,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
          title: "Pickup Location",
        });

        // Add destination marker (drop)
        new google.maps.Marker({
          position: destination,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
          title: "Drop Location",
        });

        // Fit bounds to show entire route
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(origin);
        bounds.extend(destination);
        map.fitBounds(bounds);
      } catch (err) {
        console.error("Error drawing route:", err);
      }
    };

    drawRoute();
  }, [map, showRoute, origin, destination]);

  // Show driver marker with live tracking
  useEffect(() => {
    if (!map || !showDriverMarker || !driverLocation) return;

    if (!driverMarker) {
      // Create driver marker (auto/bike icon)
      const marker = new google.maps.Marker({
        position: driverLocation,
        map,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
          scale: 2,
          anchor: new google.maps.Point(12, 22),
        },
        title: "Driver Location",
        animation: google.maps.Animation.DROP,
      });

      setDriverMarker(marker);
    } else {
      // Animate driver marker to new position
      animateMarker(driverMarker, driverLocation);
    }
  }, [map, showDriverMarker, driverLocation]);

  // Show user's current location with blue dot
  useEffect(() => {
    if (!map || !showUserLocation) return;

    if (!userMarker) {
      const marker = new google.maps.Marker({
        position: center,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        title: "Your Location",
        zIndex: 1000,
      });

      // Add accuracy circle
      new google.maps.Circle({
        map,
        center: center,
        radius: 50, // 50 meters accuracy
        fillColor: "#4285F4",
        fillOpacity: 0.1,
        strokeColor: "#4285F4",
        strokeOpacity: 0.3,
        strokeWeight: 1,
      });

      setUserMarker(marker);
    } else {
      userMarker.setPosition(center);
    }
  // Show nearby drivers (autos/bikes) - Legacy support
  useEffect(() => {
    if (!map || nearbyDrivers.length === 0) return;

    // Clear existing markers
    nearbyMarkers.forEach(marker => marker.setMap(null));

    // Create new markers for each driver
    const newMarkers = nearbyDrivers.map(driver => {
      const icon = driver.type === 'auto' ? '🛺' : '🏍️';
      
      const marker = new google.maps.Marker({
        position: { lat: driver.lat, lng: driver.lng },
        map,
        label: {
          text: icon,
          fontSize: "24px",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0.1,
          fillOpacity: 0,
          strokeOpacity: 0,
        },
        title: `${driver.type === 'auto' ? 'Auto' : 'Bike'} Driver`,
        optimized: false,
      });

      return marker;
    });

    setNearbyMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, nearbyDrivers]);

  // Show nearby vehicles with real-time tracking and 3D markers
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Filter vehicles by type if specified
    const filteredVehicles = vehicleType 
      ? nearbyVehicles.filter(v => v.type === vehicleType)
      : nearbyVehicles;

    // Get current markers
    const currentMarkers = new Map(vehicleMarkers);
    const vehicleIds = new Set(filteredVehicles.map(v => v.id));

    // Remove markers for vehicles that no longer exist
    currentMarkers.forEach((marker, id) => {
      if (!vehicleIds.has(id)) {
        marker.setMap(null);
        currentMarkers.delete(id);
      }
    });

    // Update or create markers for each vehicle
    filteredVehicles.forEach(vehicle => {
      const existingMarker = currentMarkers.get(vehicle.id);

      // Get vehicle icon based on type
      const vehicleIcon = getVehicleIcon(vehicle.type, vehicle.bearing);

      if (existingMarker) {
        // Update existing marker with smooth animation
        animateMarkerToPosition(existingMarker, {
          lat: vehicle.lat,
          lng: vehicle.lng
        }, vehicle.bearing);
        
        // Update icon with new bearing
        existingMarker.setIcon(vehicleIcon);
      } else {
        // Create new marker with 3D effect
        const marker = new google.maps.Marker({
          position: { lat: vehicle.lat, lng: vehicle.lng },
          map,
          icon: vehicleIcon,
          title: `${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} - ${vehicle.driver.name}`,
          optimized: false,
          zIndex: 1000,
        });

        // Add click listener to show vehicle info
        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: system-ui;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                  ${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                </h3>
                <p style="margin: 4px 0; font-size: 12px;">
                  <strong>Driver:</strong> ${vehicle.driver.name}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                  <strong>Rating:</strong> ⭐ ${vehicle.driver.rating.toFixed(1)}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                  <strong>Vehicle:</strong> ${vehicle.driver.vehicleNumber}
                </p>
                <p style="margin: 4px 0; font-size: 12px; color: ${vehicle.status === 'available' ? '#22c55e' : '#ef4444'};">
                  <strong>Status:</strong> ${vehicle.status === 'available' ? '✓ Available' : '✕ Busy'}
                </p>
              </div>
            `,
          });
          infoWindow.open(map, marker);
        });

        currentMarkers.set(vehicle.id, marker);
      }
    });

    setVehicleMarkers(currentMarkers);

    // Cleanup on unmount
    return () => {
      currentMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, nearbyVehicles, vehicleType]);

  // Get 3D vehicle icon with rotation based on bearing
  const getVehicleIcon = (type: 'bike' | 'auto' | 'car', bearing: number) => {
    const colors = {
      bike: '#3b82f6', // Blue
      auto: '#FFC107', // Yellow
      car: '#8b5cf6', // Purple
    };

    // SVG path for vehicle marker with arrow pointing direction
    const svgPath = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        <g transform="translate(20, 20) rotate(${bearing})">
          <!-- Vehicle body -->
          <circle cx="0" cy="0" r="12" fill="${colors[type]}" filter="url(#shadow)"/>
          <circle cx="0" cy="0" r="10" fill="white" opacity="0.3"/>
          
          <!-- Direction arrow -->
          <path d="M 0,-8 L 4,0 L 0,-4 L -4,0 Z" fill="white"/>
        </g>
        
        <!-- Availability indicator -->
        <circle cx="32" cy="8" r="4" fill="#22c55e" stroke="white" stroke-width="2"/>
      </svg>
    `;

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgPath),
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20),
    };
  };

  // Animate marker to new position with bearing rotation
  const animateMarkerToPosition = (
    marker: google.maps.Marker,
    newPosition: { lat: number; lng: number },
    bearing: number
  ) => {
    const currentPos = marker.getPosition();
    if (!currentPos) return;

    const startLat = currentPos.lat();
    const startLng = currentPos.lng();
    const endLat = newPosition.lat;
    const endLng = newPosition.lng;

    let step = 0;
    const steps = 30; // Smoother animation with more steps
    const interval = 2000 / steps; // Complete in 2 seconds

    const animate = () => {
      step++;
      const progress = easeInOutQuad(step / steps);

      const lat = startLat + (endLat - startLat) * progress;
      const lng = startLng + (endLng - startLng) * progress;

      marker.setPosition({ lat, lng });

      if (step < steps) {
        setTimeout(animate, interval);
      }
    };

    animate();
  };

  // Easing function for smooth animation
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  if (error) {
    return (
      <div className={className}>
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-red-600 font-semibold mb-2">Map Not Available</p>
          <p className="text-sm text-gray-600">{error}</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left text-xs">
            <p className="font-semibold mb-2">To enable maps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Get API key from <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">Google Cloud Console</a></li>
              <li>Copy <code className="bg-gray-200 px-1 rounded">.env.example</code> to <code className="bg-gray-200 px-1 rounded">.env</code></li>
              <li>Add: <code className="bg-gray-200 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
              <li>Restart dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div ref={mapRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
