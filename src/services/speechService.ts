export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
    this.loadVoices();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  private loadVoices() {
    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    updateVoices();
    this.synthesis.addEventListener('voiceschanged', updateVoices);
  }

  public isSupported(): boolean {
    return this.recognition !== null && 'speechSynthesis' in window;
  }

  public async startListening(): Promise<SpeechRecognitionResult> {
    if (!this.recognition || this.isListening) {
      throw new Error('Speech recognition not available or already listening');
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('Speech recognition not available'));

      this.isListening = true;

      this.recognition.onresult = (event) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        this.isListening = false;
        resolve({ transcript, confidence });
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getIdealParentVoice(): SpeechSynthesisVoice | null {
    // Prefer female voices that sound warm and nurturing
    const preferredVoices = [
      'Google UK English Female',
      'Microsoft Zira Desktop',
      'Alex',
      'Samantha',
      'Victoria',
      'Karen',
      'Moira'
    ];

    for (const voiceName of preferredVoices) {
      const voice = this.voices.find(v => v.name.includes(voiceName));
      if (voice) return voice;
    }

    // Fallback to any female voice
    const femaleVoice = this.voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      v.gender === 'female'
    );

    if (femaleVoice) return femaleVoice;

    // Final fallback to default voice
    return this.voices[0] || null;
  }

  public async speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice to ideal parent voice
      const idealVoice = this.getIdealParentVoice();
      if (idealVoice) {
        utterance.voice = idealVoice;
      }

      // Configure speech parameters for warm, nurturing delivery
      utterance.rate = options.rate || 0.85; // Slightly slower for comfort
      utterance.pitch = options.pitch || 1.1; // Slightly higher for warmth
      utterance.volume = options.volume || 0.9;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    this.synthesis.cancel();
  }

  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export const speechService = new SpeechService();