import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Lightbulb } from 'lucide-react';

interface ShareStepProps {
  conversation: any;
  onNext: (data: { userMessage: string }) => void;
  onBack: () => void;
}

const ShareStep: React.FC<ShareStepProps> = ({ conversation, onNext, onBack }) => {
  const [userMessage, setUserMessage] = useState(conversation.userMessage || '');
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (value: string) => {
    setUserMessage(value);
    setIsValid(value.trim().length >= 10);
  };

  const handleNext = () => {
    if (isValid) {
      onNext({ userMessage: userMessage.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey && isValid) {
      handleNext();
    }
  };

  const promptExamples = [
    "I'm feeling overwhelmed and don't know if I'm good enough...",
    "I made a mistake today and I'm being really hard on myself...",
    "I'm scared about this big decision I need to make...",
    "I feel like I don't deserve love or happiness...",
    "I'm struggling with feeling abandoned and alone...",
    "I need reassurance that everything will be okay..."
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-rose-400 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Share What's in Your Heart
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This is a safe space to express your feelings, fears, or anything you need support with. 
          Your ideal parent is here to listen with love and understanding.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            What would you like to share with your ideal parent?
          </label>
          <textarea
            id="message"
            value={userMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="I'm feeling really anxious about work tomorrow. I keep thinking I'm not good enough and that everyone will see that I'm a fraud. I wish someone could tell me that I'm worthy and that it's okay to feel scared sometimes..."
            className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
            maxLength={1000}
          />
          <div className="flex justify-between items-center text-sm">
            <span className={`${isValid ? 'text-green-600' : 'text-gray-400'}`}>
              {isValid ? '✓ Ready to receive love' : 'Please share at least 10 characters'}
            </span>
            <span className="text-gray-400">
              {userMessage.length}/1000
            </span>
          </div>
        </div>

        {/* Example prompts */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-5 h-5 text-purple-500 mr-2" />
            <h3 className="font-medium text-gray-800">Need inspiration? You might share:</h3>
          </div>
          <div className="grid gap-2">
            {promptExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleInputChange(example)}
                className="text-left text-sm text-gray-600 hover:text-purple-600 hover:bg-white p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
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
          disabled={!isValid}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isValid
              ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center text-xs text-gray-400">
        Press Cmd+Enter to continue quickly
      </div>
    </div>
  );
};

export default ShareStep;