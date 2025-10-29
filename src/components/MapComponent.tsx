import { useEffect, useRef, useState, useMemo } from "react";
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
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize arrays to prevent unnecessary re-renders
  // Only update when the JSON representation changes
  const nearbyDriversKey = JSON.stringify(nearbyDrivers);
  const nearbyVehiclesKey = JSON.stringify(nearbyVehicles.map(v => ({ id: v.id, lat: v.lat, lng: v.lng, bearing: v.bearing, type: v.type })));

  // Initialize Google Maps ONCE
  useEffect(() => {
    let mounted = true;
    
    const initMap = async () => {
      try {
        // Check if API key is set
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        console.log('API Key check:', apiKey ? 'Found' : 'Missing');
        
        if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
          setError("Map configuration needed");
          setLoading(false);
          return;
        }

        // Load Google Maps script if not already loaded
        if (!window.google?.maps) {
          console.log('Loading Google Maps script...');
          
          // Add error callback for Google Maps
          (window as any).gm_authFailure = () => {
            console.error('Google Maps authentication failed');
            if (mounted) {
              setError('Map service authentication failed');
              setLoading(false);
            }
          };
          
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log('Google Maps script loaded successfully');
              // Wait for google.maps to be fully available
              setTimeout(resolve, 100);
            };
            script.onerror = (e) => {
              console.error('Failed to load Google Maps script:', e);
              reject(new Error('Network error'));
            };
            document.head.appendChild(script);
          });
        }

        if (!mounted || !mapRef.current) {
          return;
        }

        // Check if google.maps is available
        if (!window.google || !window.google.maps) {
          console.error('Google Maps failed to load');
          if (mounted) {
            setError('Unable to load map. Please check your internet connection.');
            setLoading(false);
          }
          return;
        }
        
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
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        });

        if (!mounted) return;

        console.log('Map instance created successfully');
        setMap(mapInstance);
        
        // Enable real-time traffic layer
        const traffic = new google.maps.TrafficLayer();
        traffic.setMap(mapInstance);
        setTrafficLayer(traffic);
        console.log('Traffic layer enabled');
        
        setLoading(false);

        if (onMapLoad) {
          onMapLoad(mapInstance);
        }
      } catch (err) {
        console.error("Error initializing map:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load map";
        
        if (!mounted) return;
        
        // Simplify error messages for users
        if (errorMessage.includes('ApiTargetBlockedMapError') || 
            errorMessage.includes('ApiNotActivatedMapError') ||
            errorMessage.includes('BillingNotEnabledMapError')) {
          setError("Map service unavailable");
        } else if (errorMessage.includes('InvalidKeyMapError')) {
          setError("Map configuration error");
        } else {
          setError("Cannot connect to map service");
        }
        setLoading(false);
      }
    };

    initMap();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once!

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
      animateMarkerToPosition(driverMarker, driverLocation, 0);
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
  }, [map, showUserLocation, center]);

  // Show nearby drivers (autos/bikes) - Legacy support with enhanced icons
  useEffect(() => {
    if (!map || nearbyDrivers.length === 0) {
      // Clear markers if no drivers
      setNearbyMarkers(prev => {
        prev.forEach(marker => marker.setMap(null));
        return [];
      });
      return;
    }

    // Clear existing markers
    setNearbyMarkers(prev => {
      prev.forEach(marker => marker.setMap(null));
      
      // Create new markers for each driver using enhanced vehicle icons
      const newMarkers = nearbyDrivers.map(driver => {
        // Use enhanced vehicle icons with default bearing (0 = north)
        const vehicleIcon = getVehicleIcon(driver.type, 0);
        
        const marker = new google.maps.Marker({
          position: { lat: driver.lat, lng: driver.lng },
          map,
          icon: vehicleIcon,
          title: `${driver.type === 'auto' ? 'Auto' : 'Bike'} Driver`,
          optimized: false,
          animation: google.maps.Animation.DROP,
          zIndex: 900,
        });

        // Add info window on click
        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: system-ui;">
                <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
                  ${driver.type === 'auto' ? 'Auto Rickshaw' : 'Bike'}
                </h3>
                <p style="margin: 2px 0; font-size: 12px; color: #22c55e;">
                  ✓ Available
                </p>
              </div>
            `,
          });
          infoWindow.open(map, marker);
        });

        return marker;
      });
      
      return newMarkers;
    });

    return () => {
      // Cleanup on unmount
      setNearbyMarkers(prev => {
        prev.forEach(marker => marker.setMap(null));
        return [];
      });
    };
  }, [map, nearbyDriversKey]); // Use JSON key instead of array reference

  // Show nearby vehicles with real-time tracking and 3D markers
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Filter vehicles by type if specified
    const filteredVehicles = vehicleType 
      ? nearbyVehicles.filter(v => v.type === vehicleType)
      : nearbyVehicles;

    // Use functional update to avoid reading vehicleMarkers from state
    setVehicleMarkers(prevMarkers => {
      const currentMarkers = new Map(prevMarkers);
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

      return currentMarkers;
    });

    // No cleanup needed here - we manage markers within the setVehicleMarkers callback
  }, [map, nearbyVehiclesKey, vehicleType]); // Use JSON key instead of array reference

  // Cleanup all markers on component unmount
  useEffect(() => {
    return () => {
      // Clean up vehicle markers
      vehicleMarkers.forEach(marker => marker.setMap(null));
      
      // Clean up nearby markers
      nearbyMarkers.forEach(marker => marker.setMap(null));
      
      // Clean up driver marker
      if (driverMarker) {
        driverMarker.setMap(null);
      }
      
      // Clean up user marker
      if (userMarker) {
        userMarker.setMap(null);
      }
      
      // Clean up route polyline
      if (routePolyline) {
        routePolyline.setMap(null);
      }
    };
  }, []); // Empty deps - only run on unmount

  // Toggle traffic layer visibility
  const toggleTraffic = () => {
    if (trafficLayer) {
      if (showTraffic) {
        trafficLayer.setMap(null);
      } else {
        trafficLayer.setMap(map);
      }
      setShowTraffic(!showTraffic);
    }
  };

  // Get vehicle icon with proper rotation - using your provided image style
  const getVehicleIcon = (type: 'bike' | 'auto' | 'car', bearing: number) => {
    let vehicleSvg = '';
    
    if (type === 'bike') {
      // Blue/gray motorcycle like your image
      vehicleSvg = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20) rotate(${bearing}) translate(-20, -20)">
            <!-- Motorcycle body -->
            <ellipse cx="20" cy="20" rx="6" ry="10" fill="#5a6c7d"/>
            <ellipse cx="20" cy="19" rx="4" ry="8" fill="#7a8c9d"/>
            <!-- Seat (orange/red) -->
            <ellipse cx="20" cy="21" rx="5" ry="3" fill="#d4763c"/>
            <!-- Wheels -->
            <circle cx="19" cy="27" r="3" fill="#2c3e50"/>
            <circle cx="19" cy="27" r="1.5" fill="#95a5a6"/>
            <circle cx="21" cy="27" r="3" fill="#2c3e50"/>
            <circle cx="21" cy="27" r="1.5" fill="#95a5a6"/>
            <!-- Handlebars -->
            <rect x="14" y="13" width="1.5" height="4" fill="#7a8c9d" rx="0.5"/>
            <rect x="24.5" y="13" width="1.5" height="4" fill="#7a8c9d" rx="0.5"/>
            <!-- Headlight -->
            <circle cx="20" cy="12" r="1.5" fill="#fff9c4"/>
          </g>
        </svg>
      `;
    } else if (type === 'auto') {
      // Green auto with yellow canopy like your image
      vehicleSvg = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20) rotate(${bearing}) translate(-20, -20)">
            <!-- Main body (green) -->
            <path d="M 12,15 L 12,24 L 14,27 L 26,27 L 28,24 L 28,15 Z" fill="#4caf50" stroke="#2e7d32" stroke-width="0.5"/>
            <!-- Canopy (yellow) -->
            <ellipse cx="20" cy="13" rx="9" ry="3" fill="#ffc107"/>
            <rect x="11" y="13" width="18" height="2" fill="#ffc107" rx="1"/>
            <!-- Windshield -->
            <rect x="15" y="16" width="10" height="3" fill="#b3e5fc" opacity="0.6"/>
            <!-- Wheels -->
            <circle cx="20" cy="28" r="2" fill="#424242"/>
            <circle cx="15" cy="28" r="2" fill="#424242"/>
            <circle cx="25" cy="28" r="2" fill="#424242"/>
          </g>
        </svg>
      `;
    } else { // car
      // Orange/red car like your image
      vehicleSvg = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(20, 20) rotate(${bearing}) translate(-20, -20)">
            <!-- Car body (orange/red) -->
            <path d="M 11,16 L 13,14 L 13,25 L 15,28 L 25,28 L 27,25 L 27,14 L 29,16 Z" fill="#ff5722" stroke="#d84315" stroke-width="0.5"/>
            <!-- Roof -->
            <rect x="13.5" y="16" width="13" height="6" fill="#ff6f3c" opacity="0.9" rx="1"/>
            <!-- Windshield -->
            <rect x="14" y="17" width="12" height="2.5" fill="#5d4037" opacity="0.7"/>
            <!-- Windows -->
            <rect x="14" y="21" width="4.5" height="3" fill="#5d4037" opacity="0.6"/>
            <rect x="21.5" y="21" width="4.5" height="3" fill="#5d4037" opacity="0.6"/>
            <!-- Wheels -->
            <circle cx="15" cy="29" r="2.5" fill="#212121"/>
            <circle cx="15" cy="29" r="1.2" fill="#757575"/>
            <circle cx="25" cy="29" r="2.5" fill="#212121"/>
            <circle cx="25" cy="29" r="1.2" fill="#757575"/>
            <!-- Headlights -->
            <circle cx="16" cy="13" r="1" fill="#fff9c4"/>
            <circle cx="24" cy="13" r="1" fill="#fff9c4"/>
          </g>
        </svg>
      `;
    }

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(vehicleSvg),
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
          <div className="text-6xl mb-4">�</div>
          <p className="text-gray-800 font-semibold mb-2 text-lg">Map Unavailable</p>
          <p className="text-sm text-gray-600 mb-4">Please check your internet connection and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`} style={{ minHeight: '300px' }}>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '300px' }} />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
