// Voice Command Service - Bilingual (Telugu & English)
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
  private currentLanguage: 'en-IN' | 'te-IN' = 'en-IN';
  
  // Command patterns in both languages
  private commands = {
    // Booking commands
    'book': {
      en: ['book auto', 'book a ride', 'need auto', 'call auto', 'get auto'],
      te: ['ఆటో బుక్ చేయండి', 'ఆటో పిలవండి', 'ఆటో కావాలి'],
      action: 'START_BOOKING',
    },
    'cancel': {
      en: ['cancel ride', 'cancel booking', 'cancel auto'],
      te: ['రైడ్ రద్దు చేయండి', 'బుకింగ్ రద్దు'],
      action: 'CANCEL_RIDE',
    },
    // Location commands
    'current_location': {
      en: ['current location', 'my location', 'where am i', 'use current location'],
      te: ['ప్రస్తుత లొకేషన్', 'నా లొకేషన్', 'ఇక్కడ నుండి'],
      action: 'USE_CURRENT_LOCATION',
    },
    // Navigation
    'home': {
      en: ['go home', 'take me home', 'home screen'],
      te: ['ఇంటికి వెళ్ళు', 'హోమ్ స్క్రీన్'],
      action: 'NAVIGATE_HOME',
    },
    // SOS
    'emergency': {
      en: ['emergency', 'help', 'sos', 'danger', 'unsafe'],
      te: ['ఎమర్జెన్సీ', 'సహాయం', 'ప్రమాదం'],
      action: 'TRIGGER_SOS',
    },
    // Payment
    'payment': {
      en: ['pay now', 'make payment', 'pay cash', 'pay online'],
      te: ['చెల్లించండి', 'పేమెంట్ చేయండి', 'క్యాష్', 'ఆన్లైన్'],
      action: 'OPEN_PAYMENT',
    },
    // Share trip
    'share': {
      en: ['share trip', 'share location', 'share ride'],
      te: ['ట్రిప్ షేర్ చేయండి', 'లొకేషన్ షేర్ చేయండి'],
      action: 'SHARE_TRIP',
    },
    // Call driver
    'call_driver': {
      en: ['call driver', 'phone driver', 'contact driver'],
      te: ['డ్రైవర్ కు కాల్ చేయండి', 'డ్రైవర్ ను పిలవండి'],
      action: 'CALL_DRIVER',
    },
    // Fare
    'fare': {
      en: ['how much', 'what is fare', 'show fare', 'price', 'cost'],
      te: ['ఎంత', 'ఛార్జీ ఎంత', 'ధర చూపించు'],
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
    this.speak(
      this.currentLanguage === 'en-IN' 
        ? 'Listening... Say your command'
        : 'వినుతున్నాను... మీ ఆదేశం చెప్పండి',
      this.currentLanguage
    );

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
        this.speak(
          this.currentLanguage === 'en-IN'
            ? "I didn't hear anything"
            : 'ఏమీ వినపడలేదు',
          this.currentLanguage
        );
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
      const patterns = [...cmd.en, ...cmd.te];
      
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
  speak(text: string, language: 'en-IN' | 'te-IN' = 'en-IN'): void {
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
  setLanguage(language: 'en-IN' | 'te-IN'): void {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  getLanguage(): 'en-IN' | 'te-IN' {
    return this.currentLanguage;
  }

  // Pre-defined voice responses
  getVoiceResponse(action: string): VoiceResponse {
    const responses: Record<string, { en: string; te: string }> = {
      RIDE_CONFIRMED: {
        en: 'Your ride has been confirmed. Driver is on the way.',
        te: 'మీ రైడ్ కన్ఫర్మ్ అయింది. డ్రైవర్ మీ దగ్గరకు వస్తున్నారు.',
      },
      DRIVER_ARRIVED: {
        en: 'Your driver has arrived',
        te: 'మీ డ్రైవర్ వచ్చారు',
      },
      TRIP_STARTED: {
        en: 'Trip started. Have a safe journey!',
        te: 'ట్రిప్ ప్రారంభమైంది. సురక్షిత ప్రయాణం!',
      },
      TRIP_COMPLETED: {
        en: 'Trip completed. Thank you for riding with us!',
        te: 'ట్రిప్ పూర్తయింది. ధన్యవాదాలు!',
      },
      PAYMENT_SUCCESSFUL: {
        en: 'Payment successful',
        te: 'చెల్లింపు విజయవంతమైంది',
      },
      SOS_ACTIVATED: {
        en: 'Emergency alert activated. Contacting your emergency contacts.',
        te: 'ఎమర్జెన్సీ అలర్ట్ యాక్టివ్ అయింది. మీ ఎమర్జెన్సీ కాంటాక్ట్‌లను సంప్రదిస్తోంది.',
      },
    };

    const response = responses[action];
    if (!response) return { text: '' };

    const text = this.currentLanguage === 'en-IN' ? response.en : response.te;
    return { text };
  }

  // Announce driver details
  announceDriverDetails(driverName: string, vehicleNumber: string, rating: number): void {
    const text = this.currentLanguage === 'en-IN'
      ? `Your driver ${driverName} is coming in vehicle number ${vehicleNumber}. Driver rating is ${rating} stars.`
      : `మీ డ్రైవర్ ${driverName} వాహనం నంబర్ ${vehicleNumber}లో వస్తున్నారు. డ్రైవర్ రేటింగ్ ${rating} స్టార్స్.`;
    
    this.speak(text, this.currentLanguage);
  }

  // Announce fare
  announceFare(amount: number): void {
    const text = this.currentLanguage === 'en-IN'
      ? `Your total fare is ${amount} rupees`
      : `మీ మొత్తం ఛార్జీ ${amount} రూపాయలు`;
    
    this.speak(text, this.currentLanguage);
  }

  // Announce ETA
  announceETA(minutes: number): void {
    const text = this.currentLanguage === 'en-IN'
      ? `Driver will arrive in approximately ${minutes} minutes`
      : `డ్రైవర్ సుమారు ${minutes} నిమిషాల్లో చేరుకుంటారు`;
    
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
