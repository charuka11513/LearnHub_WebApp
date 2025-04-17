import React, { useState } from 'react';
import { TrashIcon, EditIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dateUtils';

interface CommentItemProps {
  comment: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
  };
  postId: string;
  onUpdateComment: (postId: string, commentId: string, content: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  onUpdateComment,
  onDeleteComment
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const isCurrentUserComment = user?.id === comment.userId;

  const avatarUrls = [
    'https://avatar.iran.liara.run/public/1',
    'https://avatar.iran.liara.run/public/2',
    'https://avatar.iran.liara.run/public/3',
    'https://avatar.iran.liara.run/public/4',
    'https://avatar.iran.liara.run/public/5',
    'https://avatar.iran.liara.run/public/6',
  ];

  const getAvatarUrl = (userId: string) => {
    if (!userId) return avatarUrls[0]; // Fallback for empty userId
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarUrls[hash % avatarUrls.length];
  };

  const handleUpdate = async () => {
    if (!editedContent.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    try {
      onUpdateComment(postId, comment.id, editedContent);
      alert('Failed to update comment');
    }
  }; 

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      onDeleteComment(postId, comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0">
        <img
          src={getAvatarUrl(comment.userId)}
          alt={comment.userName || 'User'}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = avatarUrls[0]; // Fallback on image error
          }}
        />
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-start">
          <div>
            <h5 className="text-sm font-medium text-gray-900">{comment.userName}</h5>
            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
          </div>
          {isCurrentUserComment && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-500 hover:text-blue-600"
              >
                <EditIcon size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-600"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;