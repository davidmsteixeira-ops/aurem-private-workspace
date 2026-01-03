import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Plus, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getAuthInfo } from '@/hooks/UserInfo';
import { toast } from 'sonner';

interface Message {
  id: string;
  user_id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  client_id: number;
  user_id: number;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How should we approach the upcoming product launch communication?",
  "What are the key brand principles to consider for our new packaging?",
  "Review our latest marketing copy for brand alignment.",
  "Suggest ways to strengthen our positioning in the European market.",
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    client_id: 1,
    user_id: 2,
    title: 'Q4 Marketing Strategy',
    lastMessage: 'Based on your brand guidelines...',
    timestamp: new Date('2024-12-20'),
  },
  {
    id: '2',
    client_id: 1,
    user_id: 2,
    title: 'Packaging Design Review',
    lastMessage: 'The proposed materials align with...',
    timestamp: new Date('2024-12-18'),
  },
  {
    id: '3',
    client_id: 1,
    user_id: 2,
    title: 'Press Release Tone',
    lastMessage: 'I recommend a more understated approach...',
    timestamp: new Date('2024-12-15'),
  },
];

export default function BrandIntelligence() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      user_id: 2,
      conversation_id: 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        user_id: 2,
        conversation_id: 1,
        role: 'assistant',
        content: `Thank you for your question regarding Fungisteel's brand strategy. Based on your Brand Vault documentation, I'd recommend approaching this with careful consideration of your core positioning pillars.

Your brand voice emphasizes quiet confidence and precision. Any communication should lead with the innovation narrative rather than sustainability claims—let the excellence speak for itself.

I'd suggest structuring your approach around three key elements:

1. **Material storytelling** — Lead with the transformative potential of bio-composite technology
2. **Partnership framing** — Position this as a collaborative opportunity rather than a transactional relationship  
3. **Selective messaging** — Remember that your audience is design-led decision makers, not general contractors

Would you like me to elaborate on any of these recommendations?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const startNewConversation = () => {
    setMessages([]);
    setSelectedConversation(null);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversation Sidebar */}
        <div className="w-72 border-r border-border bg-card/50 flex flex-col">
          <div className="p-4 border-b border-border">
            <button
              onClick={startNewConversation}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent hover:bg-accent/80 rounded-sm text-sm font-medium transition-colors duration-300"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              New Conversation
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <p className="px-3 py-2 text-xs uppercase tracking-wide-luxury text-muted-foreground">
              Recent
            </p>
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-sm transition-colors duration-200 mb-1",
                  selectedConversation === conv.id
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-serif text-3xl text-foreground mb-3">
                    Brand Intelligence
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Strategic guidance grounded in your brand foundation. 
                    Ask questions about positioning, communications, or brand alignment.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-full space-y-3"
                >
                  <p className="text-xs uppercase tracking-wide-luxury text-muted-foreground text-center mb-4">
                    Suggested Questions
                  </p>
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuestionClick(question)}
                      className="w-full text-left p-4 border border-border rounded-sm hover:bg-accent/50 transition-colors duration-200 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {question}
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex gap-4",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-sm px-5 py-4",
                          message.role === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border"
                        )}
                      >
                        <div 
                          className={cn(
                            "text-sm leading-relaxed whitespace-pre-line",
                            message.role === 'assistant' && "text-muted-foreground"
                          )}
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>')
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="bg-card border border-border rounded-sm px-5 py-4">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="border-t border-border p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 bg-card border border-border rounded-sm p-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about brand strategy, communications, or alignment..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "p-3 rounded-sm transition-all duration-200",
                    inputValue.trim()
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-accent text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Responses are informed by your Brand Vault documentation
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
