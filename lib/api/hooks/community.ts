import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Post, Comment } from '@/lib/types';
import toast from 'react-hot-toast';

// Query keys
export const communityKeys = {
  all: ['community'] as const,
  posts: () => [...communityKeys.all, 'posts'] as const,
  postsList: (params: any) => [...communityKeys.posts(), 'list', params] as const,
  post: (id: string) => [...communityKeys.posts(), 'detail', id] as const,
  comments: (postId: string) => [...communityKeys.all, 'comments', postId] as const,
};

// Get posts
export const usePosts = (params: any = {}) => {
  return useQuery({
    queryKey: communityKeys.postsList(params),
    queryFn: async (): Promise<{ posts: Post[]; total: number }> => {
      const response = await api.community.getPosts(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: communityKeys.post(id),
    queryFn: async (): Promise<Post> => {
      const response = await api.community.getPost(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get comments for a post
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: communityKeys.comments(postId),
    queryFn: async (): Promise<Comment[]> => {
      const response = await api.community.getComments(postId);
      return response.data;
    },
    enabled: !!postId,
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; images?: string[]; category?: string }) => {
      const response = await api.community.createPost(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create post';
      toast.error(message);
    },
  });
};

// Update post mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.community.updatePost(id, data);
      return response.data;
    },
    onSuccess: (data, { id }) => {
      // Update the specific post in cache
      queryClient.setQueryData(communityKeys.post(id), data);
      
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update post';
      toast.error(message);
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.community.deletePost(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: communityKeys.post(id) });
      
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
      toast.success('Post deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete post';
      toast.error(message);
    },
  });
};

// Like post mutation
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.community.likePost(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific post in cache
      queryClient.setQueryData(communityKeys.post(id), (old: Post | undefined) => {
        if (old) {
          return { ...old, liked: true, likes: old.likes + 1 };
        }
        return old;
      });

      // Update posts list cache
      queryClient.setQueriesData({ queryKey: communityKeys.posts() }, (old: any) => {
        if (old?.posts) {
          return {
            ...old,
            posts: old.posts.map((post: Post) =>
              post.id === id ? { ...post, liked: true, likes: post.likes + 1 } : post
            ),
          };
        }
        return old;
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to like post';
      toast.error(message);
    },
  });
};

// Unlike post mutation
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.community.unlikePost(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific post in cache
      queryClient.setQueryData(communityKeys.post(id), (old: Post | undefined) => {
        if (old) {
          return { ...old, liked: false, likes: Math.max(0, old.likes - 1) };
        }
        return old;
      });

      // Update posts list cache
      queryClient.setQueriesData({ queryKey: communityKeys.posts() }, (old: any) => {
        if (old?.posts) {
          return {
            ...old,
            posts: old.posts.map((post: Post) =>
              post.id === id ? { ...post, liked: false, likes: Math.max(0, post.likes - 1) } : post
            ),
          };
        }
        return old;
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to unlike post';
      toast.error(message);
    },
  });
};

// Create comment mutation
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: string; data: { content: string; parentId?: string } }) => {
      const response = await api.community.createComment(postId, data);
      return response.data;
    },
    onSuccess: (data, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(postId) });
      
      // Update post comment count
      queryClient.setQueryData(communityKeys.post(postId), (old: Post | undefined) => {
        if (old) {
          return { ...old, comments: old.comments + 1 };
        }
        return old;
      });

      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    },
  });
};

// Update comment mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { content: string } }) => {
      const response = await api.community.updateComment(id, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update comment';
      toast.error(message);
    },
  });
};

// Delete comment mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.community.deleteComment(id);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete comment';
      toast.error(message);
    },
  });
};

// Like comment mutation
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.community.likeComment(id);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to like comment';
      toast.error(message);
    },
  });
};

// Unlike comment mutation
export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.community.unlikeComment(id);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to unlike comment';
      toast.error(message);
    },
  });
};
