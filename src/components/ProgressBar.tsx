import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  const stepLabels = ['Share', 'Choose Tone', 'Receive Love', 'Reflect'];

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-rose-400 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-sm">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`flex items-center space-x-1 ${
              index < currentStep
                ? 'text-rose-600'
                : index === currentStep
                ? 'text-rose-500 font-medium'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                index < currentStep
                  ? 'bg-rose-500 text-white'
                  : index === currentStep
                  ? 'bg-rose-100 text-rose-600 border-2 border-rose-500'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;