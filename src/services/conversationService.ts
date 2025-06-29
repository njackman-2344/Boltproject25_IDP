import { ParentTone } from '../types';
import { openaiService } from './openaiService';
import { speechService } from './speechService';

export interface ConversationRequest {
  userMessage: string;
  parentTone: ParentTone['id'];
  useOpenAI?: boolean;
}

export interface ConversationResponse {
  parentResponse: string;
  audioUrl?: string;
  audioBlob?: Blob;
}

export class ConversationService {
  private generateFallbackResponse(tone: ParentTone['id'], userMessage: string): string {
    const responses = {
      nurturing: this.generateNurturingResponse(),
      validating: this.generateValidatingResponse(),
      protective: this.generateProtectiveResponse(),
      encouraging: this.generateEncouragingResponse()
    };

    return responses[tone] || responses.nurturing;
  }

  private generateNurturingResponse(): string {
    const responses = [
      `Oh dear one, come here. I can sense how much you're carrying right now, and I want you to know that everything you're feeling is completely valid and understandable.

You are so incredibly precious, and nothing could ever change that. When you're struggling like this, it doesn't make you weak. It makes you human, and it makes you brave for sharing these feelings.

Take a deep breath with me. Feel how much you are valued. You are safe here, and you always will be.`,

      `My dear, I see you. I see your beautiful heart and all the care you have to give. I also see your struggles, and I want you to know that it's okay to feel everything you're feeling right now.

You don't have to be strong all the time. You can rest here in this moment, and just be exactly who you are. Let me offer you comfort right now.

Breathe with me, dear one. You are valued beyond measure.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateValidatingResponse(): string {
    const responses = [
      `I hear you, and I want you to know that everything you're feeling makes complete sense. Your emotions are valid, your experiences matter, and your perspective is important.

What you're going through is real and significant. I believe you, I see you, and I understand why this feels so overwhelming. You're not being dramatic - you're being human.

I see the beautiful, complex person you are. You matter so much.`,

      `Your feelings are so valid, my dear. Everything you're experiencing makes perfect sense given what you've been through. Your emotional responses are normal and healthy.

You don't need to justify your feelings. They belong to you, they're real, and they deserve to be acknowledged. I'm here to witness them with you.

I believe in you completely. You have everything within you that you need to navigate this journey.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateProtectiveResponse(): string {
    const responses = [
      `Listen to me carefully: You are safe now. I am here, and I will not let anything harm you. You don't have to face this alone anymore.

I will always stand between you and anything that tries to hurt you. You have someone in your corner now who will support you and protect your tender heart.

You can rest now. You can let your guard down. I've got you, and I'm not going anywhere. Breathe with me. You are safe. You are protected. You are valued.`,

      `My brave one, you don't have to be strong right now. I am strong for both of us. I am your shield, your safe harbor, your unwavering supporter.

No one will hurt you on my watch. Whatever you're facing, we face it together. Your wellbeing is my priority, always.

You are safe, you are protected, and you are deeply valued.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateEncouragingResponse(): string {
    const responses = [
      `Look at you - look at how far you've come! I am so incredibly proud of you for sharing this with me. It takes real courage to be vulnerable, and you just showed me how brave you are.

I see so much strength in you, even when you can't see it yourself. You have everything within you that you need to handle this. I believe in you completely.

You are capable of amazing things. You are worthy of all the good that life has to offer. I'm going to be here cheering you on every step of the way.`,

      `I am so proud of the person you're becoming. Every day, you're choosing growth over comfort, courage over fear, and that takes incredible strength.

You have such a beautiful spirit, and I can see it shining even when you feel dim. I believe in your ability to grow, to learn, to create the life you want.

Keep going, my dear one. You are going to be okay. More than okay - you're going to thrive.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  public async generateResponse(request: ConversationRequest): Promise<ConversationResponse> {
    let parentResponse: string;
    let audioUrl: string | undefined;
    let audioBlob: Blob | undefined;

    try {
      // Always try OpenAI first if available, silently fall back to local responses
      if (openaiService.isReady()) {
        try {
          parentResponse = await openaiService.generateIdealParentResponse(
            request.userMessage, 
            request.parentTone
          );
        } catch (openaiError) {
          console.warn('OpenAI response generation failed, using fallback:', openaiError);
          // Simulate processing delay for fallback responses
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          parentResponse = this.generateFallbackResponse(request.parentTone, request.userMessage);
        }
      } else {
        // Simulate processing delay for fallback responses
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        parentResponse = this.generateFallbackResponse(request.parentTone, request.userMessage);
      }

      // Generate audio response - try OpenAI TTS first, fall back to browser TTS
      try {
        if (openaiService.isReady()) {
          // Use OpenAI TTS
          const ttsResult = await openaiService.textToSpeech(parentResponse);
          audioUrl = ttsResult.audioUrl;
          audioBlob = ttsResult.audioBlob;
        } else {
          // Use browser TTS as fallback
          await speechService.speak(parentResponse);
        }
      } catch (audioError) {
        console.warn('Audio generation failed, text-only response:', audioError);
        // Continue without audio - text response is still available
      }

      return {
        parentResponse,
        audioUrl,
        audioBlob
      };

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Final fallback to basic nurturing response
      parentResponse = "I hear you, dear one, and I want you to know that you are deeply valued and supported. Whatever you're going through, you don't have to face it alone. I'm here with you.";
      
      return { parentResponse };
    }
  }
}

export const conversationService = new ConversationService();