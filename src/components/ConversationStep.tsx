import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Heart, Copy, Check } from 'lucide-react';

interface ConversationStepProps {
  conversation: any;
  onNext: (data: { parentResponse: string }) => void;
  onBack: () => void;
  onRegenerate: (newResponse: string) => void;
}

const ConversationStep: React.FC<ConversationStepProps> = ({ 
  conversation, 
  onNext, 
  onBack, 
  onRegenerate 
}) => {
  const [parentResponse, setParentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Generate ideal parent response based on tone and user message
  const generateResponse = async (tone: string, userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    const responses = {
      nurturing: `Oh sweetheart, come here. I can feel how much you're hurting right now, and I want you to know that everything you're feeling is completely valid and understandable.

You are so incredibly precious to me, and nothing - absolutely nothing - could ever change that. When you're struggling like this, it doesn't make you weak or broken. It makes you human, and it makes you brave for sharing these feelings with me.

I want you to know that you are enough, exactly as you are right now. You don't have to earn my love or prove your worth. You are worthy simply because you exist, because you are you.

Let me hold this worry for you for a while. You don't have to carry it all alone. I'm here, I'm not going anywhere, and together we can get through anything.

Take a deep breath with me. Feel how much you are loved. You are safe here with me, and you always will be.`,

      validating: `I hear you, and I want you to know that everything you're feeling makes complete sense. Your emotions are valid, your experiences matter, and your perspective is important.

What you're going through is real and significant. I believe you, I see you, and I understand why this feels so overwhelming. You're not being dramatic or too sensitive - you're being human.

It takes so much courage to share these vulnerable feelings, and I'm honored that you trust me with them. Your willingness to be open about your struggles shows incredible strength, even when you don't feel strong.

You have every right to feel exactly what you're feeling. Your emotions are giving you important information, and I want you to know that it's okay to sit with these feelings without having to fix them right away.

I see the beautiful, complex person you are - not just your struggles, but your resilience, your heart, and your unique way of experiencing the world. You matter so much.`,

      protective: `Listen to me carefully: You are safe now. I am here, and I will not let anything harm you. You don't have to face this alone anymore.

I want you to know that I will always stand between you and anything that tries to hurt you. You have someone in your corner now who will fight for you, defend you, and protect your tender heart.

What happened to you wasn't your fault. You didn't deserve it, you couldn't have prevented it, and you are not responsible for other people's actions or choices. I will keep saying this until you believe it.

You are under my protection now. No one gets to treat you poorly - not others, and especially not that critical voice in your head. I'm going to help you build boundaries that keep you safe.

You can rest now. You can let your guard down. I've got you, and I'm not going anywhere. You are precious cargo, and I will handle you with the care and gentleness you deserve.

Breathe with me. You are safe. You are protected. You are loved.`,

      encouraging: `Look at you - look at how far you've come! I am so incredibly proud of you for sharing this with me. It takes real courage to be vulnerable, and you just showed me how brave you are.

I see so much strength in you, even when you can't see it yourself. The fact that you're here, that you're trying, that you're reaching out - that tells me everything I need to know about your resilience and your heart.

You have everything within you that you need to handle this. I believe in you completely. You've overcome challenges before, and you have the wisdom and strength to navigate this too.

I want you to remember that growth isn't always comfortable, but it's always worth it. Every step you take, even the small ones, is moving you toward the life and the healing you deserve.

You are capable of amazing things. You are worthy of all the good that life has to offer. And most importantly, you have the power to create positive change in your life.

I'm going to be here cheering you on every step of the way. You've got this, and you've got me. Together, there's nothing we can't handle.`
    };

    return responses[tone as keyof typeof responses] || responses.nurturing;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateResponse(conversation.parentTone, conversation.userMessage);
      setParentResponse(response);
    } catch (error) {
      setParentResponse("I'm here for you, sweetheart. Let me try to respond again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateResponse(conversation.parentTone, conversation.userMessage);
      setParentResponse(response);
      onRegenerate(response);
    } catch (error) {
      setParentResponse("I'm here for you, sweetheart. Let me try to respond again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parentResponse);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text');
    }
  };

  const handleNext = () => {
    if (parentResponse) {
      onNext({ parentResponse });
    }
  };

  useEffect(() => {
    if (conversation.parentResponse) {
      setParentResponse(conversation.parentResponse);
      setIsLoading(false);
    } else {
      handleGenerate();
    }
  }, []);

  const getToneColor = (tone: string) => {
    const colors = {
      nurturing: 'from-green-400 to-emerald-500',
      validating: 'from-blue-400 to-indigo-500',
      protective: 'from-purple-400 to-violet-500',
      encouraging: 'from-amber-400 to-orange-500'
    };
    return colors[tone as keyof typeof colors] || colors.nurturing;
  };

  const getToneLabel = (tone: string) => {
    const labels = {
      nurturing: 'Nurturing & Comforting',
      validating: 'Validating & Understanding',
      protective: 'Protective & Reassuring',
      encouraging: 'Encouraging & Empowering'
    };
    return labels[tone as keyof typeof labels] || 'Nurturing & Comforting';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getToneColor(conversation.parentTone)} flex items-center justify-center mx-auto`}>
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Your Ideal Parent Responds
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg text-gray-600">With:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getToneColor(conversation.parentTone)} text-white`}>
            {getToneLabel(conversation.parentTone)}
          </span>
        </div>
      </div>

      {/* Parent Response */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200 p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
            <p className="text-gray-600 animate-pulse">Your ideal parent is preparing a loving response...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Heart className="w-5 h-5 text-rose-400 mr-2" />
                Your Ideal Parent Says:
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {parentResponse}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isLoading && (
        <div className="flex justify-center">
          <button
            onClick={handleRegenerate}
            className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Hear Another Response</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading || !parentResponse}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            !isLoading && parentResponse
              ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Reflect on This</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ConversationStep;