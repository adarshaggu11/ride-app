// Google Maps Service for real-time location and routing
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
}

interface RouteInfo {
  distance: string;
  duration: string;
  distanceValue: number;
  durationValue: number;
  polyline: string;
}

class MapService {
  private loader: any; // Using any for Loader to avoid type issues
  private map: google.maps.Map | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private markers: google.maps.Marker[] = [];

  constructor() {
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
      version: 'weekly',
      libraries: ['places', 'geometry', 'directions'],
    });
  }

  async initMap(element: HTMLElement, center: Location): Promise<google.maps.Map> {
    await this.loader.load();
    
    this.map = new google.maps.Map(element, {
      center,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#10b981',
        strokeWeight: 5,
      },
    });

    return this.map;
  }

  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  async calculateRoute(origin: Location, destination: Location): Promise<RouteInfo | null> {
    if (!this.directionsService || !this.directionsRenderer) {
      throw new Error('Map not initialized');
    }

    try {
      const result = await this.directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        avoidTolls: true,
      });

      if (result.routes.length > 0) {
        this.directionsRenderer.setDirections(result);
        const route = result.routes[0];
        const leg = route.legs[0];

        return {
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          distanceValue: leg.distance?.value || 0,
          durationValue: leg.duration?.value || 0,
          polyline: route.overview_polyline || '',
        };
      }

      return null;
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    }
  }

  addMarker(location: Location, title: string, icon?: string): google.maps.Marker | null {
    if (!this.map) return null;

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title,
      icon: icon || undefined,
      animation: google.maps.Animation.DROP,
    });

    this.markers.push(marker);
    return marker;
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  updateDriverLocation(location: Location, driverMarker?: google.maps.Marker): google.maps.Marker {
    if (driverMarker) {
      driverMarker.setPosition(location);
      return driverMarker;
    }

    return this.addMarker(location, 'Driver Location', '/auto-icon.png') || new google.maps.Marker();
  }

  async searchPlaces(query: string): Promise<google.maps.places.AutocompletePrediction[]> {
    await this.loader.load();
    const service = new google.maps.places.AutocompleteService();

    return new Promise((resolve, reject) => {
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'in' }, // Restrict to India
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            reject(new Error('Place search failed'));
          }
        }
      );
    });
  }

  async geocodeAddress(placeId: string): Promise<Location | null> {
    await this.loader.load();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          resolve(null);
        }
      });
    });
  }

  fitBounds(locations: Location[]): void {
    if (!this.map || locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    locations.forEach((loc) => bounds.extend(loc));
    this.map.fitBounds(bounds, 100); // 100px padding
  }

  destroy(): void {
    this.clearMarkers();
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
  }
}

export const mapService = new MapService();
export type { Location, RouteInfo };
