import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import WelcomeStep from './components/WelcomeStep';
import ShareStep from './components/ShareStep';
import ToneSelectStep from './components/ToneSelectStep';
import VoiceConversationStep from './components/VoiceConversationStep';
import ReflectionStep from './components/ReflectionStep';
import HistoryStep from './components/HistoryStep';
import ProgressBar from './components/ProgressBar';
import { Conversation, Reflection } from './types';

type Step = 'welcome' | 'share' | 'tone' | 'conversation' | 'reflection' | 'history';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [currentConversation, setCurrentConversation] = useState<Partial<Conversation>>({});
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('personalDevelopmentConversations');
    const savedReflections = localStorage.getItem('personalDevelopmentReflections');
    
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
    if (savedReflections) {
      setReflections(JSON.parse(savedReflections));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('personalDevelopmentConversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('personalDevelopmentReflections', JSON.stringify(reflections));
  }, [reflections]);

  const saveConversation = (conversation: Conversation) => {
    setConversations(prev => [...prev, conversation]);
  };

  const saveReflection = (reflection: Reflection) => {
    setReflections(prev => [...prev, reflection]);
  };

  const startNewConversation = () => {
    setCurrentConversation({});
    setCurrentStep('share');
  };

  const getStepNumber = (step: Step): number => {
    const stepMap = { welcome: 0, share: 1, tone: 2, conversation: 3, reflection: 4, history: 5 };
    return stepMap[step];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Important Disclaimer:</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            This app is designed for general wellness and personal development purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or mental health condition. The content provided is not a substitute for professional healthcare or therapy.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            If you are experiencing significant distress or mental health concerns, please consult a qualified healthcare provider.
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-3 rounded-full shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Ideal Parent Figure
          </h1>
          <p className="text-gray-600 text-lg">
            Voice-powered personal development conversations for emotional growth and self-compassion
          </p>
        </div>
        
        {/* Bolt.new Badge */}
      <div class="fixed top-4 right-4 z-50">
        <a href="https://bolt.new/?rid=os72mi" target="_blank" rel="noopener noreferrer" 
         class="block transition-all duration-300 hover:shadow-2xl">
        <img src="https://storage.bolt.army/white_circle_360x360.png" 
           alt="Built with Bolt.new badge" 
           class="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
           onanimationend="this.classList.add('animated')" />
          </a>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'history' && (
          <ProgressBar currentStep={getStepNumber(currentStep)} totalSteps={4} />
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          {currentStep === 'welcome' && (
            <WelcomeStep 
              onStart={startNewConversation}
              onViewHistory={() => setCurrentStep('history')}
              hasHistory={conversations.length > 0}
            />
          )}
          
          {currentStep === 'share' && (
            <ShareStep
              conversation={currentConversation}
              onNext={(data) => {
                setCurrentConversation(prev => ({ ...prev, ...data }));
                setCurrentStep('tone');
              }}
              onBack={() => setCurrentStep('welcome')}
            />
          )}
          
          {currentStep === 'tone' && (
            <ToneSelectStep
              conversation={currentConversation}
              onNext={(data) => {
                setCurrentConversation(prev => ({ ...prev, ...data }));
                setCurrentStep('conversation');
              }}
              onBack={() => setCurrentStep('share')}
            />
          )}
          
          {currentStep === 'conversation' && (
            <VoiceConversationStep
              conversation={currentConversation}
              onNext={(data) => {
                const completeConversation: Conversation = {
                  id: Date.now().toString(),
                  userMessage: currentConversation.userMessage || '',
                  parentTone: currentConversation.parentTone || 'nurturing',
                  parentResponse: data.parentResponse,
                  timestamp: new Date().toISOString(),
                };
                saveConversation(completeConversation);
                setCurrentConversation(completeConversation);
                setCurrentStep('reflection');
              }}
              onBack={() => setCurrentStep('tone')}
              onRegenerate={(newResponse) => {
                setCurrentConversation(prev => ({ ...prev, parentResponse: newResponse }));
              }}
            />
          )}
          
          {currentStep === 'reflection' && (
            <ReflectionStep
              conversation={currentConversation as Conversation}
              onComplete={(reflection) => {
                saveReflection(reflection);
                setCurrentStep('welcome');
              }}
              onSkip={() => setCurrentStep('welcome')}
            />
          )}
          
          {currentStep === 'history' && (
            <HistoryStep
              conversations={conversations}
              reflections={reflections}
              onBack={() => setCurrentStep('welcome')}
              onSelectConversation={(conversation) => {
                setCurrentConversation(conversation);
                setCurrentStep('conversation');
              }}
            />
          )}
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-gray-500 mb-6">
          <p>🔒 All conversations are private and stored securely on your device</p>
          <p className="mt-1">🎤 Voice processing happens in your browser for maximum privacy</p>
        </div>

        {/* Bottom Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Important Disclaimer:</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            This app is designed for general wellness and personal development purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or mental health condition. The content provided is not a substitute for professional healthcare or therapy.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            If you are experiencing significant distress or mental health concerns, please consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
