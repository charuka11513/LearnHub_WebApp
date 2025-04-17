import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface CommentFormProps {
  postId: string;
  onAddComment: (postId: string, comment: any) => void;
}

const avatarUrls = [
  'https://avatar.iran.liara.run/public/1',
  'https://avatar.iran.liara.run/public/2',
  'https://avatar.iran.liara.run/public/3',
  'https://avatar.iran.liara.run/public/4',
  'https://avatar.iran.liara.run/public/5',
  'https://avatar.iran.liara.run/public/6',
];

const getAvatarUrl = (userId: string) => {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarUrls[hash % avatarUrls.length];
};

const CommentForm: React.FC<CommentFormProps> = ({ postId, onAddComment }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // *** Changed Code Section Start ***
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      alert('Please log in to comment');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/comments/post/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          content,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to post comment: ${response.status}`);
      }
      const newComment = await response.json();
      onAddComment(postId, newComment);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };
  // *** Changed Code Section End ***

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-start space-x-2">
        {/* *** Changed Code Section Start *** */}
        <img
          src={user?.avatarUrl || getAvatarUrl(user?.id || 'default')}
          alt={user?.name || 'User'}
          className="w-8 h-8 rounded-full"
        />
        {/* *** Changed Code Section End *** */}
        <div className="flex-1">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;