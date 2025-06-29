import React, { useState } from 'react';
import { Heart, SkipBack as Skip, CheckCircle, Star, Download } from 'lucide-react';
import { Conversation, Reflection } from '../types';
import { fileService } from '../services/fileService';

interface ReflectionStepProps {
  conversation: Conversation;
  onComplete: (reflection: Reflection) => void;
  onSkip: () => void;
}

const ReflectionStep: React.FC<ReflectionStepProps> = ({ conversation, onComplete, onSkip }) => {
  const [emotionalState, setEmotionalState] = useState('');
  const [insights, setInsights] = useState('');
  const [wellnessRating, setWellnessRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (wellnessRating === 0) return;

    setIsSubmitting(true);
    
    const reflection: Reflection = {
      id: Date.now().toString(),
      conversationId: conversation.id,
      emotionalState: emotionalState.trim(),
      insights: insights.trim(),
      healingRating: wellnessRating,
      timestamp: new Date().toISOString(),
    };

    // Simulate a brief delay for better UX
    setTimeout(() => {
      onComplete(reflection);
    }, 500);
  };

  const handleDownload = () => {
    const reflection: Reflection = {
      id: Date.now().toString(),
      conversationId: conversation.id,
      emotionalState: emotionalState.trim(),
      insights: insights.trim(),
      healingRating: wellnessRating || 3, // Default rating for download
      timestamp: new Date().toISOString(),
    };

    fileService.downloadConversation(conversation, reflection);
  };

  const wellnessLabels = [
    '', 'Still Struggling', 'Slightly Better', 'Somewhat Supported', 'Much Better', 'Deeply Encouraged'
  ];

  const getWellnessEmoji = (rating: number) => {
    const emojis = ['', '💙', '🤗', '💚', '✨', '🌟'];
    return emojis[rating] || '';
  };

  const emotionalStates = [
    'Supported', 'Understood', 'Encouraged', 'Calm', 'Validated', 'Peaceful', 
    'Hopeful', 'Grateful', 'Relieved', 'Empowered', 'Confident', 'Accepted'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-rose-400 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          How Does This Feel?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take a moment to notice what's happening in your mind and body after receiving 
          this supportive response. Your awareness is part of your personal growth process.
        </p>
      </div>

      <div className="space-y-8">
        {/* Wellness Rating */}
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-800">
            How supported do you feel after this conversation?
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setWellnessRating(rating)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  wellnessRating === rating
                    ? 'border-rose-400 bg-rose-400 text-white scale-110'
                    : 'border-gray-300 hover:border-rose-300 bg-white hover:bg-rose-50'
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    wellnessRating === rating ? 'fill-current' : ''
                  }`}
                />
              </button>
            ))}
          </div>
          {wellnessRating > 0 && (
            <div className="text-center text-lg">
              <span className="mr-2">{getWellnessEmoji(wellnessRating)}</span>
              <span className="font-medium text-gray-700">{wellnessLabels[wellnessRating]}</span>
            </div>
          )}
        </div>

        {/* Emotional State */}
        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-800">
            How are you feeling right now? (optional)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {emotionalStates.map((state) => (
              <button
                key={state}
                onClick={() => setEmotionalState(state)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  emotionalState === state
                    ? 'bg-rose-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-600'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={emotionalState}
            onChange={(e) => setEmotionalState(e.target.value)}
            placeholder="Or describe in your own words..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-200"
            maxLength={100}
          />
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <label htmlFor="insights" className="block text-lg font-medium text-gray-800">
            Any insights or thoughts you'd like to capture? (optional)
          </label>
          <textarea
            id="insights"
            value={insights}
            onChange={(e) => setInsights(e.target.value)}
            placeholder="What did this conversation help you realize? What felt especially supportive? What would you like to remember?"
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-400">
            {insights.length}/500
          </div>
        </div>

        {/* Download Option */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Save This Conversation</h3>
              <p className="text-blue-600 text-sm">Download your conversation and reflection as a text file</p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleSubmit}
            disabled={wellnessRating === 0 || isSubmitting}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              wellnessRating > 0 && !isSubmitting
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Complete Reflection</span>
              </>
            )}
          </button>

          <button
            onClick={onSkip}
            className="flex items-center space-x-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <Skip className="w-4 h-4" />
            <span>Skip for now</span>
          </button>
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
        <div className="text-center space-y-2">
          <p className="text-rose-800 font-medium">
            💝 You are doing wonderful work supporting your emotional well-being
          </p>
          <p className="text-rose-600 text-sm">
            Every conversation is a step toward greater self-compassion and personal growth
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReflectionStep;