import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';

interface AIResponseStepProps {
  scenario: any;
  onNext: (data: { aiResponse: string }) => void;
  onBack: () => void;
  onRegenerate: (newResponse: string) => void;
}

const AIResponseStep: React.FC<AIResponseStepProps> = ({ scenario, onNext, onBack, onRegenerate }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Mock AI response generation
  const generateResponse = async (tone: string, userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    const responses = {
      gentle: `I can understand how overwhelming that moment must have felt. When children have big emotions in public spaces, it often triggers our own feelings of embarrassment and frustration - and that's completely normal.

Here's what an ideal gentle response might look like:

**In the moment:**
• Take a deep breath and get down to your child's eye level
• Use a calm, quiet voice: "I can see you really wanted that candy. It's hard when we can't have what we want."
• Acknowledge their feelings: "You seem really disappointed and that's okay."

**Moving forward:**
• Set clear expectations before entering stores: "We're going to get groceries today, not treats"
• Offer choices within boundaries: "Would you like to help me find the apples or the bread?"
• Practice self-compassion - every parent has moments like this

**Remember:** Your child's behavior in that moment doesn't reflect your parenting. They're still learning to manage big emotions, and you're learning too. The fact that you're reflecting on this shows how much you care.`,

      firm: `This situation called for clear, confident leadership - and it's a learning opportunity for both you and your child.

Here's how to handle this with firm but loving boundaries:

**Immediate response:**
• Stay calm and speak clearly: "No means no. We're not buying candy today."
• Don't negotiate or explain extensively in the moment
• If the tantrum continues: "I can see you're upset. We can talk about this when you're calm."

**Follow-through:**
• If needed, calmly leave the store or finish shopping without engaging the tantrum
• Later, when emotions are settled, have a conversation about expectations
• Be consistent - if you say no, mean it every time

**Building respect:**
• Prepare your child before outings with clear rules
• Praise good behavior when they accept "no" gracefully
• Model the calm, respectful behavior you want to see

**Key insight:** Children need to know you're in control, especially when they feel out of control. Your consistency and calm confidence will help them feel secure.`,

      playful: `Oh, the classic grocery store showdown! Every parent has been there, and guess what? There are some fun ways to turn these moments into connection opportunities.

Here's how to add some magic to challenging moments:

**Creative in-the-moment responses:**
• "Wow, your disappointed voice is SO loud! I wonder if your quiet voice can be even more powerful?"
• "I see a child who REALLY wanted candy. Should we pretend to be sad candy that didn't get chosen?" (dramatic sad face)
• "Your body is telling me you have BIG feelings. Can you show me what disappointed looks like with your whole body?"

**Prevention with play:**
• Before shopping: "We're going on a grocery adventure! You're my special helper who finds the best vegetables."
• Create a game: "Can you spot 3 red things that aren't candy?"
• Sing a silly song about grocery shopping

**Turning tears into giggles:**
• "I bet if we were in a candy store right now, the candy would be jumping up and down saying 'Pick me! Pick me!'"
• Use humor to connect: "My ears heard 'no candy' but I think your heart heard 'no fun ever again'!"

**The magic:** When we meet big emotions with playfulness (not dismissiveness), we teach kids that feelings are manageable and connection is always possible.`,

      understanding: `What you experienced is one of parenting's most universal challenges, and your feelings about it are completely valid. Let's explore this with compassion for everyone involved.

**Understanding the layers:**
This moment likely involved multiple complex emotions - your child's disappointment, your embarrassment, frustration at feeling judged, and perhaps guilt about your reaction. All of these feelings make perfect sense.

**An empathetic approach:**
• First, validate yourself: "That was really hard, and I did my best in a difficult moment."
• For your child: "I can see this was really important to you. It's hard when grown-ups say no to things we want."
• Acknowledge the public aspect: "I notice I felt worried about what other people were thinking."

**Deeper insights:**
• Children's tantrums often happen when they're overwhelmed, not manipulative
• Your reaction shows you care deeply about being a good parent
• Every parent has moments they wish they could handle differently

**Moving forward with wisdom:**
• Practice self-forgiveness - harsh self-judgment doesn't help anyone
• Talk to your child later: "I got loud earlier, and I'm sorry. Let's think about better ways to handle big feelings."
• Consider what this moment taught you about your triggers and values

**Remember:** The goal isn't perfect parenting - it's conscious, loving parenting that allows for growth and repair.`
    };

    return responses[tone as keyof typeof responses] || responses.understanding;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateResponse(scenario.tone, scenario.userInput);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("I apologize, but I'm having trouble generating a response right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateResponse(scenario.tone, scenario.userInput);
      setAiResponse(response);
      onRegenerate(response);
    } catch (error) {
      setAiResponse("I apologize, but I'm having trouble generating a response right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiResponse);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text');
    }
  };

  const handleNext = () => {
    if (aiResponse) {
      onNext({ aiResponse });
    }
  };

  useEffect(() => {
    if (scenario.aiResponse) {
      setAiResponse(scenario.aiResponse);
      setIsLoading(false);
    } else {
      handleGenerate();
    }
  }, []);

  const getToneColor = (tone: string) => {
    const colors = {
      gentle: 'from-green-400 to-emerald-500',
      firm: 'from-red-400 to-rose-500',
      playful: 'from-yellow-400 to-orange-500',
      understanding: 'from-blue-400 to-indigo-500'
    };
    return colors[tone as keyof typeof colors] || colors.understanding;
  };

  const getToneLabel = (tone: string) => {
    const labels = {
      gentle: 'Gentle & Nurturing',
      firm: 'Firm & Clear',
      playful: 'Playful & Creative',
      understanding: 'Empathetic & Wise'
    };
    return labels[tone as keyof typeof labels] || 'Empathetic & Wise';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getToneColor(scenario.tone)} flex items-center justify-center mx-auto`}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Your Ideal Parent Response
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg text-gray-600">Tone:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getToneColor(scenario.tone)} text-white`}>
            {getToneLabel(scenario.tone)}
          </span>
        </div>
      </div>

      {/* AI Response */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600 animate-pulse">Crafting your personalized response...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800">AI-Generated Guidance:</h3>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {aiResponse}
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
            <span>Generate Different Response</span>
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
          disabled={isLoading || !aiResponse}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            !isLoading && aiResponse
              ? 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Reflect on Response</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIResponseStep;