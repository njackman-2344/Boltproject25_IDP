import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

interface MemoryInputStepProps {
  scenario: any;
  onNext: (data: { userInput: string }) => void;
  onBack: () => void;
}

const MemoryInputStep: React.FC<MemoryInputStepProps> = ({ scenario, onNext, onBack }) => {
  const [userInput, setUserInput] = useState(scenario.userInput || '');
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (value: string) => {
    setUserInput(value);
    setIsValid(value.trim().length >= 10);
  };

  const handleNext = () => {
    if (isValid) {
      onNext({ userInput: userInput.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey && isValid) {
      handleNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Share Your Parenting Scenario
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe a challenging moment or situation you've experienced with your child. 
          The more details you provide, the more personalized guidance you'll receive.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="scenario" className="block text-sm font-medium text-gray-700">
            What happened? How did you feel?
          </label>
          <textarea
            id="scenario"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="My 4-year-old threw a tantrum at the grocery store when I said no to candy. I felt embarrassed and frustrated, and ended up raising my voice. Other parents were staring and I didn't know what to do..."
            className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
            maxLength={1000}
          />
          <div className="flex justify-between items-center text-sm">
            <span className={`${isValid ? 'text-green-600' : 'text-gray-400'}`}>
              {isValid ? '✓ Ready to proceed' : 'Please write at least 10 characters'}
            </span>
            <span className="text-gray-400">
              {userInput.length}/1000
            </span>
          </div>
        </div>

        {/* Example prompts */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 className="font-medium text-gray-800 mb-3">Need inspiration? Try describing:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• A moment when you lost your patience</li>
            <li>• A difficult conversation you had to have</li>
            <li>• A situation where you weren't sure how to respond</li>
            <li>• A behavior challenge you're facing</li>
          </ul>
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
              ? 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
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

export default MemoryInputStep;