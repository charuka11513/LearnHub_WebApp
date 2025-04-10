import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
interface CommentFormProps {
  postId: string;
  onAddComment: (postId: string, comment: any) => void;
}
const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onAddComment
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    user
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      // This would be an API call in a real app
      const newComment = {
        id: Date.now().toString(),
        userId: user?.id,
        userName: user?.name,
        content,
        createdAt: new Date().toISOString()
      };
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      onAddComment(postId, newComment);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };
  return <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-start space-x-2">
        <img src={user?.avatarUrl || 'https://i.pravatar.cc/150?u=default'} alt={user?.name || 'User'} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Add a comment..." className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={loading || !content.trim()} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>;
};
export default CommentForm;