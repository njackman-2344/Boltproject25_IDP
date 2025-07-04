import React from 'react';
import { MessageCircle, History, Heart, Shield, Sparkles, Mic } from 'lucide-react';

interface WelcomeStepProps {
  onStart: () => void;
  onViewHistory: () => void;
  hasHistory: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart, onViewHistory, hasHistory }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome to Your Voice-Powered Personal Development Journey
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Connect with the supportive, nurturing voice you need. Share what's on your mind 
          through voice and receive encouraging spoken responses that can support emotional growth and 
          self-compassion. Experience daily 10-minute voice conversations and notice the positive impact on your confidence, emotional balance, and overall well-being.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 my-12">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-100">
          <div className="bg-rose-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Voice Conversations</h3>
          <p className="text-sm text-gray-600">
            Speak naturally and hear supportive responses with a warm, encouraging voice
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
          <div className="bg-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Supportive Responses</h3>
          <p className="text-sm text-gray-600">
            Receive personalized, spoken responses tailored to support your emotional well-being
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="bg-blue-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Private & Secure</h3>
          <p className="text-sm text-gray-600">
            All voice processing happens in your browser - nothing is sent to external servers
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center mx-auto space-x-3"
        >
          <Mic className="w-5 h-5" />
          <span>Start Voice Conversation</span>
        </button>

        {hasHistory && (
          <button
            onClick={onViewHistory}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <History className="w-4 h-4" />
            <span>View My Journey</span>
          </button>
        )}
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 mt-12 border border-rose-100">
        <h3 className="font-semibold text-gray-800 mb-4">Your personal development process:</h3>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600">
          <span className="bg-white px-3 py-1 rounded-full border border-rose-200">1. Share your thoughts</span>
          <span className="text-rose-300">→</span>
          <span className="bg-white px-3 py-1 rounded-full border border-rose-200">2. Choose support style</span>
          <span className="text-rose-300">→</span>
          <span className="bg-white px-3 py-1 rounded-full border border-rose-200">3. Hear encouraging response</span>
          <span className="text-rose-300">→</span>
          <span className="bg-white px-3 py-1 rounded-full border border-rose-200">4. Reflect & grow</span>
        </div>
      </div>

      {/* Voice Requirements */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Mic className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-800">Voice Features</h4>
        </div>
        <p className="text-blue-700 text-sm">
          For the best experience, use Chrome, Safari, or Edge with microphone permissions enabled. 
          If voice features aren't available, you can still use text input as a fallback.
        </p>
      </div>

      {/* Gentle reminder */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-amber-800 text-sm">
          💝 Remember: You deserve support, encouragement, and self-compassion. Take your time and be gentle with yourself.
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;