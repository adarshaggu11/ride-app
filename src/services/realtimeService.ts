// Real-time WebSocket Service for live updates
type MessageHandler = (data: any) => void;

interface DriverUpdate {
  driverId: string;
  location: { lat: number; lng: number };
  heading: number;
  speed: number;
  timestamp: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'rider' | 'driver';
  message: string;
  timestamp: number;
  read: boolean;
}

class RealtimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private heartbeatInterval: number | null = null;

  connect(userId: string, rideId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Replace with your actual WebSocket server URL
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
        const url = `${wsUrl}?userId=${userId}${rideId ? `&rideId=${rideId}` : ''}`;
        
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopHeartbeat();
          this.attemptReconnect(userId, rideId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(data: any): void {
    const { type, payload } = data;
    const handlers = this.handlers.get(type);
    
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  subscribe(eventType: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  // Driver location updates
  subscribeToDriverLocation(rideId: string, callback: (update: DriverUpdate) => void): () => void {
    this.send('subscribe:driver_location', { rideId });
    return this.subscribe('driver_location_update', callback);
  }

  updateDriverLocation(location: { lat: number; lng: number }, heading: number, speed: number): void {
    this.send('driver_location_update', { location, heading, speed, timestamp: Date.now() });
  }

  // Chat functionality
  subscribeToChat(rideId: string, callback: (message: ChatMessage) => void): () => void {
    this.send('subscribe:chat', { rideId });
    return this.subscribe('chat_message', callback);
  }

  sendChatMessage(rideId: string, message: string, senderType: 'rider' | 'driver'): void {
    const chatMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: '', // Will be set by server
      senderType,
      message,
      timestamp: Date.now(),
      read: false,
    };
    this.send('chat_message', { rideId, ...chatMessage });
  }

  markMessageAsRead(messageId: string): void {
    this.send('mark_read', { messageId });
  }

  // Ride status updates
  subscribeToRideStatus(rideId: string, callback: (status: any) => void): () => void {
    this.send('subscribe:ride_status', { rideId });
    return this.subscribe('ride_status_update', callback);
  }

  updateRideStatus(rideId: string, status: string, data?: any): void {
    this.send('ride_status_update', { rideId, status, data, timestamp: Date.now() });
  }

  // Heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(userId: string, rideId?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId, rideId).catch(() => {
          // Connection failed, will try again
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const realtimeService = new RealtimeService();
export type { DriverUpdate, ChatMessage };
