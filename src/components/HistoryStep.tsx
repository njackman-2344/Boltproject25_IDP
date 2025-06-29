import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, MessageCircle, Heart, Eye, Download } from 'lucide-react';
import { Conversation, Reflection } from '../types';
import { fileService } from '../services/fileService';

interface HistoryStepProps {
  conversations: Conversation[];
  reflections: Reflection[];
  onBack: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const HistoryStep: React.FC<HistoryStepProps> = ({ 
  conversations, 
  reflections, 
  onBack, 
  onSelectConversation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToneFilter, setSelectedToneFilter] = useState<string>('all');

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.userMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.parentResponse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTone = selectedToneFilter === 'all' || conversation.parentTone === selectedToneFilter;
    return matchesSearch && matchesTone;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getReflectionForConversation = (conversationId: string) => {
    return reflections.find(r => r.conversationId === conversationId);
  };

  const handleDownloadAll = () => {
    fileService.downloadAllConversations(conversations, reflections);
  };

  const handleDownloadConversation = (conversation: Conversation) => {
    const reflection = getReflectionForConversation(conversation.id);
    fileService.downloadConversation(conversation, reflection);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getToneColor = (tone: string) => {
    const colors = {
      nurturing: 'bg-green-100 text-green-800',
      validating: 'bg-blue-100 text-blue-800',
      protective: 'bg-purple-100 text-purple-800',
      encouraging: 'bg-amber-100 text-amber-800'
    };
    return colors[tone as keyof typeof colors] || colors.nurturing;
  };

  const getToneLabel = (tone: string) => {
    const labels = {
      nurturing: 'Nurturing',
      validating: 'Validating',
      protective: 'Protective',
      encouraging: 'Encouraging'
    };
    return labels[tone as keyof typeof labels] || 'Nurturing';
  };

  const getWellnessStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Your Personal Development Journey
        </h2>
        <p className="text-lg text-gray-600">
          Review your conversations and see your progress in emotional growth and self-compassion
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your conversations..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-200"
          />
        </div>
        <select
          value={selectedToneFilter}
          onChange={(e) => setSelectedToneFilter(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-200"
        >
          <option value="all">All Tones</option>
          <option value="nurturing">Nurturing</option>
          <option value="validating">Validating</option>
          <option value="protective">Protective</option>
          <option value="encouraging">Encouraging</option>
        </select>
      </div>

      {/* Stats and Download */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-100">
          <div className="text-2xl font-bold text-rose-600">{conversations.length}</div>
          <div className="text-sm text-rose-800">Conversations</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{reflections.length}</div>
          <div className="text-sm text-purple-800">Reflections</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">
            {reflections.length ? Math.round(reflections.reduce((sum, r) => sum + r.healingRating, 0) / reflections.length * 10) / 10 : 0}
          </div>
          <div className="text-sm text-blue-800">Avg. Wellness</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="text-2xl font-bold text-green-600">
            {conversations.length ? Math.round((conversations.length / Math.max(1, Math.ceil((Date.now() - new Date(conversations[conversations.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)))) * 10) / 10 : 0}
          </div>
          <div className="text-sm text-green-800">Per Day</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
          <button
            onClick={handleDownloadAll}
            disabled={conversations.length === 0}
            className="w-full h-full flex flex-col items-center justify-center text-amber-600 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="w-6 h-6 mb-1" />
            <div className="text-xs text-amber-800">Download All</div>
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {conversations.length === 0 ? 'No conversations yet' : 'No conversations match your search'}
            </h3>
            <p className="text-gray-500">
              {conversations.length === 0 
                ? 'Start your first conversation to begin your personal development journey'
                : 'Try adjusting your search terms or filters'
              }
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const reflection = getReflectionForConversation(conversation.id);
            return (
              <div key={conversation.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-rose-300 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getToneColor(conversation.parentTone)}`}>
                      {getToneLabel(conversation.parentTone)}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(conversation.timestamp)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadConversation(conversation)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => onSelectConversation(conversation)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-rose-600 hover:text-rose-800 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">What you shared:</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{conversation.userMessage}</p>
                  </div>

                  {reflection && (
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 border-l-4 border-rose-400">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span className="text-sm font-medium text-gray-700">Reflection</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {getWellnessStars(reflection.healingRating)}
                        </div>
                      </div>
                      {reflection.emotionalState && (
                        <p className="text-sm text-gray-600 mb-1">Feeling: {reflection.emotionalState}</p>
                      )}
                      {reflection.insights && (
                        <p className="text-sm text-gray-600 line-clamp-2">{reflection.insights}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default HistoryStep;