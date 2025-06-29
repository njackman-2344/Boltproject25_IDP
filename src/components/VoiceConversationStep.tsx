import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Heart, Mic, MicOff, Volume2, VolumeX, Play, Pause, Copy, Check } from 'lucide-react';
import { audioService } from '../services/audioService';
import { openaiService } from '../services/openaiService';
import { conversationService } from '../services/conversationService';

interface VoiceConversationStepProps {
  conversation: any;
  onNext: (data: { parentResponse: string }) => void;
  onBack: () => void;
  onRegenerate: (newResponse: string) => void;
}

const VoiceConversationStep: React.FC<VoiceConversationStepProps> = ({ 
  conversation, 
  onNext, 
  onBack, 
  onRegenerate 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const [parentResponse, setParentResponse] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [responseAudioUrl, setResponseAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if audio recording is supported
    if (!audioService.isSupported()) {
      setError('Voice recording is not supported in your browser. Please use Chrome, Safari, or Edge for the best experience.');
      setShowTextFallback(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (responseAudioUrl) {
        URL.revokeObjectURL(responseAudioUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (conversation.parentResponse) {
      setParentResponse(conversation.parentResponse);
    }
  }, [conversation.parentResponse]);

  const startRecording = async () => {
    try {
      setError(null);
      
      const hasPermission = await audioService.requestMicrophonePermission();
      if (!hasPermission) {
        setError('Microphone permission is required for voice input. Please enable microphone access and try again.');
        setShowTextFallback(true);
        return;
      }

      await audioService.startRecording();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Recording start error:', error);
      setError('Could not start recording. Please check your microphone and try again.');
      setShowTextFallback(true);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      const result = await audioService.stopRecording();
      
      if (openaiService.isReady()) {
        // Use OpenAI Whisper for transcription
        const transcription = await openaiService.transcribeAudio(result.audioBlob);
        setTranscribedText(transcription.text);
        
        // Auto-generate response after successful transcription
        await generateResponse(transcription.text);
      } else {
        // Fallback to text input if OpenAI is not available
        setError('Voice transcription is not available. Please use text input below.');
        setShowTextFallback(true);
      }
      
    } catch (error) {
      console.error('Recording processing error:', error);
      setError('Could not process your voice input. Please try again or use text input.');
      setShowTextFallback(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateResponse = async (userMessage?: string) => {
    const messageToProcess = userMessage || conversation.userMessage || transcribedText;
    
    if (!messageToProcess.trim()) {
      setError('Please provide a message first.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Always try to use OpenAI first, fall back to local responses if not available
      const response = await conversationService.generateResponse({
        userMessage: messageToProcess,
        parentTone: conversation.parentTone,
        useOpenAI: true // Always attempt OpenAI first
      });

      setParentResponse(response.parentResponse);
      
      // Set up audio if available
      if (response.audioUrl) {
        setResponseAudioUrl(response.audioUrl);
        // Auto-play the response
        setTimeout(() => playResponse(response.audioUrl!), 500);
      }
      
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Could not generate response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playResponse = async (audioUrl: string) => {
    try {
      setIsPlayingResponse(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlayingResponse(false);
      audioRef.current.onerror = () => {
        setIsPlayingResponse(false);
        setError('Could not play audio response. You can still read the text below.');
      };
      
      await audioRef.current.play();
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlayingResponse(false);
      setError('Could not play audio response. You can still read the text below.');
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingResponse(false);
  };

  const handleRegenerate = async () => {
    await generateResponse();
    if (parentResponse) {
      onRegenerate(parentResponse);
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
          Your Supportive Voice is Listening
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg text-gray-600">Speaking with:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getToneColor(conversation.parentTone)} text-white`}>
            {getToneLabel(conversation.parentTone)}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Voice Input Section */}
      {!showTextFallback && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200 p-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Share Your Thoughts</h3>
              <p className="text-gray-600">
                {isRecording ? 'Speaking... Click to stop' : 'Click and hold to record your message'}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse'
                    : 'bg-rose-400 hover:bg-rose-500 hover:scale-105'
                } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            {isRecording && (
              <div className="text-rose-600 font-medium animate-pulse">
                🎤 Recording... Click to stop
              </div>
            )}

            {transcribedText && (
              <div className="bg-white rounded-lg p-4 border border-rose-200">
                <h4 className="font-medium text-gray-800 mb-2">You said:</h4>
                <p className="text-gray-700 italic">"{transcribedText}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text Fallback */}
      {showTextFallback && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Message</h3>
          <textarea
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            placeholder="Type what you'd like to share with your supportive voice..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => generateResponse(transcribedText)}
              disabled={!transcribedText.trim() || isProcessing}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Response
            </button>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
          <p className="text-gray-600 animate-pulse">Your supportive voice is preparing an encouraging response...</p>
        </div>
      )}

      {/* Parent Response */}
      {parentResponse && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Heart className="w-5 h-5 text-rose-400 mr-2" />
                Your Supportive Voice Says:
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Audio Controls */}
            {responseAudioUrl && (
              <div className="flex items-center space-x-4 py-2">
                {isPlayingResponse ? (
                  <button
                    onClick={stopPlayback}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={() => playResponse(responseAudioUrl)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Response</span>
                  </button>
                )}
                
                {isPlayingResponse && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm animate-pulse">Speaking...</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {parentResponse}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {parentResponse && !isProcessing && (
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
          disabled={!parentResponse || isProcessing || isPlayingResponse}
          className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
            parentResponse && !isProcessing && !isPlayingResponse
              ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Reflect on This</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
        <div className="text-center space-y-2">
          <p className="text-purple-800 font-medium text-sm">
            💝 Speak from your heart - your supportive voice is here to listen with understanding
          </p>
          <p className="text-purple-600 text-xs">
            Advanced AI voice processing for natural conversations
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceConversationStep;