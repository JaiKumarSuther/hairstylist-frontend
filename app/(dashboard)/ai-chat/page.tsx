'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles, BookOpen, Save } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MyNotes } from '@/components/ai-chat/MyNotes';
import { saveNote } from '@/lib/notes';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const MessageBubble: React.FC<{ 
  message: Message; 
  onSaveToNotes?: (message: Message) => void;
}> = ({ message, onSaveToNotes }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8">
        {isUser ? (
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg relative group ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          <p className="text-sm">{message.content}</p>
          
          {/* Save to Notes button for AI messages */}
          {!isUser && onSaveToNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSaveToNotes(message)}
              className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-background shadow-md"
            >
              <Save className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

const QuickSuggestions: React.FC<{ 
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
          className="text-xs"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI hairstyling assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const quickSuggestions = [
    'How to cut layers?',
    'Best products for curly hair',
    'Color correction tips',
    'Updo for wedding',
    'Blowout techniques'
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're asking about "${inputValue.trim()}". Here's my advice: This is a great question! For the best results, I recommend focusing on the fundamentals and practicing with different techniques. Would you like me to elaborate on any specific aspect?`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleSaveToNotes = (message: Message) => {
    if (message.type === 'ai') {
      const note = saveNote({
        title: `AI Response - ${new Date().toLocaleDateString()}`,
        content: message.content,
        category: 'Tips',
        tags: ['AI Chat', 'Auto-saved'],
        isFavorite: false,
      });
      
      toast.success('AI response saved to My Notes!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Chat
          </h1>
          <p className="text-muted-foreground">
            Get instant styling advice from our AI assistant
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Chat with AI Assistant
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotes(true)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My Notes
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onSaveToNotes={handleSaveToNotes}
                />
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
                <QuickSuggestions 
                  suggestions={quickSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about hairstyling..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Notes Modal */}
        <MyNotes
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

