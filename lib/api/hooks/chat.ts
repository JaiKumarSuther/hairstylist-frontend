import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { ChatSession, Message } from '@/lib/types';
import toast from 'react-hot-toast';

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  sessions: () => [...chatKeys.all, 'sessions'] as const,
  session: (id: string) => [...chatKeys.sessions(), id] as const,
};

// Get chat sessions
export const useChatSessions = () => {
  return useQuery({
    queryKey: chatKeys.sessions(),
    queryFn: async (): Promise<ChatSession[]> => {
      const response = await api.chat.getSessions();
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Get chat session
export const useChatSession = (id: string) => {
  return useQuery({
    queryKey: chatKeys.session(id),
    queryFn: async (): Promise<ChatSession> => {
      const response = await api.chat.getSession(id);
      return response.data;
    },
    enabled: !!id && !!localStorage.getItem('auth_token'),
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { message: string; sessionId?: string }) => {
      const response = await api.chat.sendMessage(data);
      return response.data;
    },
    onSuccess: (data) => {
      // If this is a new session, invalidate sessions list
      if (data.sessionId) {
        queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
        
        // Update the specific session cache
        queryClient.setQueryData(chatKeys.session(data.sessionId), data);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to send message';
      toast.error(message);
    },
  });
};

// Delete session mutation
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.chat.deleteSession(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: chatKeys.session(id) });
      
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
      
      toast.success('Chat session deleted');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete session';
      toast.error(message);
    },
  });
};
