// Voice Command Service
interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, any>;
}

interface VoiceResponse {
  text: string;
  action?: () => void;
}

class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private currentLanguage: 'en-IN' = 'en-IN';
  
  // Command patterns
  private commands = {
    // Booking commands
    'book': {
      patterns: ['book auto', 'book a ride', 'need auto', 'call auto', 'get auto', 'book ride'],
      action: 'START_BOOKING',
    },
    'cancel': {
      patterns: ['cancel ride', 'cancel booking', 'cancel auto'],
      action: 'CANCEL_RIDE',
    },
    // Location commands
    'current_location': {
      patterns: ['current location', 'my location', 'where am i', 'use current location'],
      action: 'USE_CURRENT_LOCATION',
    },
    // Navigation
    'home': {
      patterns: ['go home', 'take me home', 'home screen'],
      action: 'NAVIGATE_HOME',
    },
    // SOS
    'emergency': {
      patterns: ['emergency', 'help', 'sos', 'danger', 'unsafe'],
      action: 'TRIGGER_SOS',
    },
    // Payment
    'payment': {
      patterns: ['pay now', 'make payment', 'pay cash', 'show payment'],
      action: 'OPEN_PAYMENT',
    },
    // Share trip
    'share': {
      patterns: ['share trip', 'share location', 'share ride'],
      action: 'SHARE_TRIP',
    },
    // Call driver
    'call_driver': {
      patterns: ['call driver', 'phone driver', 'contact driver'],
      action: 'CALL_DRIVER',
    },
    // Fare
    'fare': {
      patterns: ['how much', 'what is fare', 'show fare', 'price', 'cost'],
      action: 'SHOW_FARE',
    },
  };

  constructor() {
    this.initializeSpeechRecognition();
    this.synthesis = window.speechSynthesis;
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = this.currentLanguage;
    } else {
      console.warn('Speech recognition not supported');
    }
  }

  // Start listening for voice commands
  startListening(callback: (command: VoiceCommand) => void): void {
    if (!this.recognition) {
      this.speak('Voice commands not supported on this device', 'en-IN');
      return;
    }

    if (this.isListening) return;

    this.isListening = true;
    this.speak('Listening... Say your command', this.currentLanguage);

    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Heard:', transcript);

      const command = this.parseCommand(transcript);
      
      if (command) {
        callback(command);
        this.speak(
          this.currentLanguage === 'en-IN'
            ? `Okay, ${command.action.replace('_', ' ').toLowerCase()}`
            : 'సరే',
          this.currentLanguage
        );
      } else {
        this.speak(
          this.currentLanguage === 'en-IN'
            ? "Sorry, I didn't understand that"
            : 'క్షమించండి, అర్థం కాలేదు',
          this.currentLanguage
        );
      }

      this.isListening = false;
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (event.error === 'no-speech') {
        this.speak("I didn't hear anything. Please try again.", this.currentLanguage);
      } else if (event.error === 'audio-capture') {
        this.speak("Microphone not accessible. Please check permissions.", this.currentLanguage);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Parse voice input into command
  private parseCommand(transcript: string): VoiceCommand | null {
    transcript = transcript.toLowerCase().trim();

    for (const [key, cmd] of Object.entries(this.commands)) {
      const patterns = cmd.patterns;
      
      for (const pattern of patterns) {
        if (transcript.includes(pattern.toLowerCase())) {
          // Extract parameters (e.g., location names)
          const parameters = this.extractParameters(transcript, pattern);
          
          return {
            command: key,
            action: cmd.action,
            parameters,
          };
        }
      }
    }

    return null;
  }

  private extractParameters(transcript: string, pattern: string): Record<string, any> {
    const params: Record<string, any> = {};

    // Extract location if mentioned
    const locationMatch = transcript.match(/(?:to|from|at)\s+([a-z\s]+)/i);
    if (locationMatch) {
      params.location = locationMatch[1].trim();
    }

    // Extract numbers (for payment amount, etc.)
    const numberMatch = transcript.match(/\d+/);
    if (numberMatch) {
      params.amount = parseInt(numberMatch[0]);
    }

    return params;
  }

  // Text-to-speech
  speak(text: string, language: 'en-IN' = 'en-IN'): void {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a natural voice
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang === language) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    this.synthesis.speak(utterance);
  }

  // Switch language
  setLanguage(language: 'en-IN'): void {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  getLanguage(): 'en-IN' {
    return this.currentLanguage;
  }

  // Pre-defined voice responses
  getVoiceResponse(action: string): VoiceResponse {
    const responses: Record<string, string> = {
      RIDE_CONFIRMED: 'Your ride has been confirmed. Driver is on the way.',
      DRIVER_ARRIVED: 'Your driver has arrived',
      TRIP_STARTED: 'Trip started. Have a safe journey!',
      TRIP_COMPLETED: 'Trip completed. Thank you for riding with us!',
      PAYMENT_SUCCESSFUL: 'Payment successful',
      SOS_ACTIVATED: 'Emergency alert activated. Contacting your emergency contacts.',
    };

    const text = responses[action] || '';
    return { text };
  }

  // Announce driver details
  announceDriverDetails(driverName: string, vehicleNumber: string, rating: number): void {
    const text = `Your driver ${driverName} is coming in vehicle number ${vehicleNumber}. Driver rating is ${rating} stars.`;
    this.speak(text, this.currentLanguage);
  }

  // Announce fare
  announceFare(amount: number): void {
    const text = `Your total fare is ${amount} rupees`;
    this.speak(text, this.currentLanguage);
  }

  // Announce ETA
  announceETA(minutes: number): void {
    const text = `Driver will arrive in approximately ${minutes} minutes`;
    this.speak(text, this.currentLanguage);
  }

  // Check if voice is supported
  isSupported(): boolean {
    return this.recognition !== null && this.synthesis !== null;
  }

  // Get microphone permission
  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}

export const voiceService = new VoiceService();
export type { VoiceCommand, VoiceResponse };
