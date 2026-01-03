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


export default function BrandIntelligence() {
  const { userInfo } = getAuthInfo();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Carregar lista de conversas (Sidebar)
  useEffect(() => {
    if (userInfo?.user_id) {
      fetchConversations();
    }
  }, [userInfo?.user_id]);

  // 2. Carregar mensagens SEMPRE que a selectedConversation mudar
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    } else {
      setMessages([]); // Limpa se for "New Conversation"
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('ai_conversations')
      .select()
      .eq('user_id', userInfo.user_id)
      .order('updated_at', { ascending: false });
    if (data) setConversations(data);
  };

  // console.log("TEST: ", conversations);

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from('ai_messages')
      .select()
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const mockAiCall = async (userPrompt: string) => {
    return "You should use precise language and factual statements while keeping sentences concise and human, avoiding jargon or overly corporate phrasing.";
  };





  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !userInfo) return;

    let currentConvId = selectedConversation;
    const userPrompt = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // A. Conversa Nova
      if (!currentConvId) {
        const { data: newConv, error: convError } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: userInfo.user_id,
            client_id: userInfo.client_id,
            title: userPrompt.substring(0, 30) + '...',
          })
          .select().single();

        if (convError) throw convError;
        currentConvId = newConv.id;
        setSelectedConversation(currentConvId);
        // Não precisamos de dar fetchConversations aqui, podemos apenas adicionar ao estado
      }

      // B. Guardar mensagem do utilizador
      const { data: userMsgData } = await supabase.from('ai_messages').insert({
        user_id: userInfo.user_id,
        conversation_id: currentConvId,
        role: 'user',
        content: userPrompt
      }).select().single();

      // Atualizar UI instantaneamente (Optimistic Update)
      setMessages(prev => [...prev, userMsgData]);

      // C. IA Response
      const aiResponse = await mockAiCall(userPrompt);
      // C. CHAMADA À EDGE FUNCTION (IA REAL)
      // const { data: aiData, error: aiError } = await supabase.functions.invoke('brand-intelligence-chat', {
      //   body: { 
      //     conversation_id: currentConvId, 
      //     message: userPrompt,
      //     client_id: userInfo.client_id 
      //   }
      // });

      // if (aiError) throw aiError;
      // const aiResponse = aiData.content;

      // D. Guardar resposta da IA
      const { data: aiMsgData } = await supabase.from('ai_messages').insert({
        user_id: 3,
        conversation_id: currentConvId,
        role: 'assistant',
        content: aiResponse
      }).select().single();

      // E. Atualizar Conversas e Metadados
      await supabase.from('ai_conversations').update({
        last_message: aiResponse.substring(0, 50),
        updated_at: new Date().toISOString()
      }).eq('id', currentConvId);

      setMessages(prev => [...prev, aiMsgData]);
      fetchConversations(); // Atualiza a ordem no sidebar

    } catch (error) {
      toast.error("The oracle is temporarily silent.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const startNewConversation = () => {
    setMessages([]);
    setSelectedConversation(null);
    setIsInitialized(false);
  };

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-4rem)]">
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
            {conversations.map((conv) => (
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
        <div className="flex-1 flex flex-col h-screen">
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
