import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
}

export interface TTSResult {
  audioUrl: string;
  audioBlob: Blob;
}

export class OpenAIService {
  private client: OpenAI | null = null;
  private isConfigured = false;

  constructor() {
    // Silently check for API key in environment
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey && apiKey.trim() && apiKey !== 'your_openai_api_key_here') {
      this.configure({ apiKey });
    }
  }

  public configure(config: OpenAIConfig) {
    try {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
      });
      this.isConfigured = true;
    } catch (error) {
      console.warn('Failed to configure OpenAI client:', error);
      this.isConfigured = false;
    }
  }

  public isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  public async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.client) {
      throw new Error('OpenAI client not configured');
    }

    try {
      const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
      
      const transcription = await this.client.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: 'en',
        response_format: 'json'
      });

      return {
        text: transcription.text,
        confidence: 1.0 // Whisper doesn't provide confidence scores
      };
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  public async generateIdealParentResponse(userMessage: string, tone: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not configured');
    }

    const systemPrompts = {
      nurturing: `You are a supportive, nurturing voice providing unconditional care and comfort. Your responses should be:
- Warm, gentle, and deeply caring
- Focused on emotional safety and comfort
- Validating of all feelings without judgment
- Offering reassurance and unconditional support
- Speaking as if comforting a beloved person
- Keep responses concise but emotionally rich (2-3 paragraphs max)
- Use "dear one," "sweetheart," or similar caring terms naturally
- Focus on wellness and emotional support, not medical advice`,

      validating: `You are a supportive voice who deeply validates and understands. Your responses should be:
- Acknowledge all feelings as completely valid and understandable
- Reflect back what you hear with empathy
- Affirm the person's experiences and perspective
- Show that their emotions make perfect sense
- Demonstrate deep listening and understanding
- Keep responses concise but emotionally rich (2-3 paragraphs max)
- Use phrases like "I hear you," "That makes complete sense," "Your feelings are valid"
- Focus on emotional validation and support`,

      protective: `You are a supportive voice who provides safety and reassurance. Your responses should be:
- Strong, secure, and reassuring
- Create a sense of safety and being supported
- Take responsibility for providing comfort and care
- Be firm about the person's worth and safety
- Offer strength when they feel vulnerable
- Keep responses concise but emotionally rich (2-3 paragraphs max)
- Use phrases like "You are safe," "I will support you," "You don't have to face this alone"
- Focus on emotional safety and support`,

      encouraging: `You are a supportive voice who empowers and encourages. Your responses should be:
- Uplifting and confidence-building
- Focus on strengths and capabilities
- Inspire hope and forward movement
- Celebrate progress and efforts
- Build inner strength and resilience
- Keep responses concise but emotionally rich (2-3 paragraphs max)
- Use phrases like "I believe in you," "You are capable," "I'm proud of you"
- Focus on personal growth and empowerment`
    };

    const systemPrompt = systemPrompts[tone as keyof typeof systemPrompts] || systemPrompts.nurturing;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 400,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      return completion.choices[0]?.message?.content || 'I hear you, and I want you to know that you are deeply valued and supported.';
    } catch (error) {
      console.error('Response generation error:', error);
      throw new Error('Failed to generate response');
    }
  }

  public async textToSpeech(text: string): Promise<TTSResult> {
    if (!this.client) {
      throw new Error('OpenAI client not configured');
    }

    try {
      const response = await this.client.audio.speech.create({
        model: 'tts-1',
        voice: 'nova', // Warm, nurturing female voice
        input: text,
        response_format: 'mp3',
        speed: 0.9 // Slightly slower for comfort
      });

      const audioBlob = new Blob([await response.arrayBuffer()], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        audioBlob
      };
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new Error('Failed to generate speech');
    }
  }
}

export const openaiService = new OpenAIService();