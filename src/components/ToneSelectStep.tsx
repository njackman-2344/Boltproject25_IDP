import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Shield, Sparkles, Star } from 'lucide-react';
import { ParentTone } from '../types';

interface ToneSelectStepProps {
  conversation: any;
  onNext: (data: { parentTone: string }) => void;
  onBack: () => void;
}

const parentTones: ParentTone[] = [
  {
    id: 'nurturing',
    label: 'Nurturing & Comforting',
    description: 'Warm, gentle responses that provide comfort and emotional safety',
    color: 'from-green-400 to-emerald-500',
    icon: 'heart'
  },
  {
    id: 'validating',
    label: 'Validating & Understanding',
    description: 'Responses that acknowledge your feelings and affirm your experiences',
    color: 'from-blue-400 to-indigo-500',
    icon: 'sparkles'
  },
  {
    id: 'protective',
    label: 'Protective & Reassuring',
    description: 'Strong, secure responses that help you feel safe and defended',
    color: 'from-purple-400 to-violet-500',
    icon: 'shield'
  },
  {
    id: 'encouraging',
    label: 'Encouraging & Empowering',
    description: 'Uplifting responses that build confidence and inner strength',
    color: 'from-amber-400 to-orange-500',
    icon: 'star'
  }
];

const ToneSelectStep: React.FC<ToneSelectStepProps> = ({ conversation, onNext, onBack }) => {
  const [selectedTone, setSelectedTone] = useState<string>(conversation.parentTone || '');

  const handleNext = () => {
    if (selectedTone) {
      onNext({ parentTone: selectedTone });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart': return <Heart className="w-6 h-6 text-white" />;
      case 'sparkles': return <Sparkles className="w-6 h-6 text-white" />;
      case 'shield': return <Shield className="w-6 h-6 text-white" />;
      case 'star': return <Star className="w-6 h-6 text-white" />;
      default: return <Heart className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          What Do You Need Right Now?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the type of parental response that would feel most healing for you in this moment. 
          Trust your instincts about what your inner child needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {parentTones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => setSelectedTone(tone.id)}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg ${
              selectedTone === tone.id
                ? 'border-rose-400 bg-rose-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tone.color} flex items-center justify-center flex-shrink-0`}>
                {getIcon(tone.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {tone.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tone.description}
                </p>
              </div>
            </div>
            {selectedTone === tone.id && (
              <div className="mt-4 pt-4 border-t border-rose-200">
                <div className="flex items-center text-rose-600 text-sm font-medium">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mr-2"></div>
                  This feels right for me
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Preview of user message */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2">What you shared:</h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {conversation.userMessage}
        </p>
      </div>

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
          disabled={!selectedTone}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            selectedTone
              ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Receive Love</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToneSelectStep;