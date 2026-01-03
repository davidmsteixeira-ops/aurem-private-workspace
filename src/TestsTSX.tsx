import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Plus, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getAuthInfo } from '@/hooks/UserInfo';
import { toast } from 'sonner';

// ... (Interfaces permanecem iguais)

export default function BrandIntelligence() {
  const { userInfo } = getAuthInfo();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Carregar lista de conversas (Sidebar) - Apenas no Load inicial
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
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userInfo.user_id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching conversations:", error);
      return;
    }
    if (data) setConversations(data);
  };

  const fetchMessages = async (convId: string) => {
    // Para UX de luxo, limpamos as mensagens antigas antes de mostrar as novas 
    // ou mantemos para uma transição suave. Aqui limpamos para evitar confusão.
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error("Could not retrieve the conversation history.");
      return;
    }
    if (data) setMessages(data);
  };

  // ... (mockAiCall e scrollToBottom permanecem iguais)

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
        conversation_id: currentConvId,
        role: 'user',
        content: userPrompt
      }).select().single();

      // Atualizar UI instantaneamente (Optimistic Update)
      setMessages(prev => [...prev, userMsgData]);

      // C. IA Response
      const aiResponse = await mockAiCall(userPrompt);

      // D. Guardar resposta da IA
      const { data: aiMsgData } = await supabase.from('ai_messages').insert({
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

  const startNewConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  // ... (O JSX permanece igual ao que já tens)
}