import React, { createContext, useContext, useState } from 'react';
import { ChatMessage, StructuredEditingPlan } from '../types';
import { MimiClientService } from '../services/mimiService';
import { useProject } from './ProjectContext';

interface MimiContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  activePlan: StructuredEditingPlan | null;
  sendMessage: (text: string) => Promise<void>;
  applyPlan: (planToApply?: StructuredEditingPlan) => void;
  dismissPlan: () => void;
  clearChat: () => void;
}

const MimiContext = createContext<MimiContextType | undefined>(undefined);

export const MimiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentProject, clips, setClips, saveProject } = useProject();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'mimi',
      content: `Hey creator! I'm Mimi. 💙\n\nNeed editing tips, creative ideas, or help with a video?\nAsk me anything in English, Tamil, or Tanglish, and let's make something amazing!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activePlan, setActivePlan] = useState<StructuredEditingPlan | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await MimiClientService.sendMessage(
        text,
        currentProject?.id || 'proj_active',
        clips,
        activePlan || undefined
      );

      const mimiMsg: ChatMessage = {
        id: `msg_mimi_${Date.now()}`,
        sender: 'mimi',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: response.language,
        editingPlan: response.editingPlan,
      };

      setMessages(prev => [...prev, mimiMsg]);

      if (response.editingPlan) {
        setActivePlan(response.editingPlan);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'system',
          content: 'Sorry, I encountered a temporary connection issue. Please try again! 💙',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const applyPlan = (planToApply?: StructuredEditingPlan) => {
    const target = planToApply || activePlan;
    if (!target) return;

    const updatedClips = MimiClientService.applyPlanToClips(target, clips);
    setClips(updatedClips);
    saveProject();

    const confirmedPlan: StructuredEditingPlan = {
      ...target,
      operations: target.operations.map(op => ({ ...op, applied: true })),
    };
    setActivePlan(null);

    setMessages(prev => [
      ...prev,
      {
        id: `msg_applied_${Date.now()}`,
        sender: 'mimi',
        content: `🎉 Awesome! I have applied all ${target.operations.length} operations to your video workspace. You can preview the result now or ask me for more refinements!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const dismissPlan = () => {
    setActivePlan(null);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'mimi',
        content: `Chat cleared! What shall we create or edit next? 💙`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActivePlan(null);
  };

  return (
    <MimiContext.Provider
      value={{
        messages,
        isTyping,
        activePlan,
        sendMessage,
        applyPlan,
        dismissPlan,
        clearChat,
      }}
    >
      {children}
    </MimiContext.Provider>
  );
};

export const useMimi = () => {
  const context = useContext(MimiContext);
  if (!context) throw new Error('useMimi must be used within a MimiProvider');
  return context;
};
