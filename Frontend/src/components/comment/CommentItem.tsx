import React, { useState } from 'react';
import { TrashIcon, EditIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dateUtils';
interface CommentItemProps {
  comment: any;
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
  const {
    user
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const isCurrentUserComment = user?.id === comment.userId;
  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    try {
      // This would be an API call in a real app
      onUpdateComment(postId, comment.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  const handleDelete = async () => {
    try {
      // This would be an API call in a real app
      onDeleteComment(postId, comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  return <div className="flex items-start space-x-2">
      <div className="flex-shrink-0">
        <img src={`https://i.pravatar.cc/150?u=${comment.userId}`} alt={comment.userName} className="w-8 h-8 rounded-full" />
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-start">
          <div>
            <h5 className="text-sm font-medium text-gray-900">
              {comment.userName}
            </h5>
            <p className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          {isCurrentUserComment && <div className="flex space-x-2">
              <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-blue-600">
                <EditIcon size={16} />
              </button>
              <button onClick={handleDelete} className="text-gray-500 hover:text-red-600">
                <TrashIcon size={16} />
              </button>
            </div>}
        </div>
        {isEditing ? <div className="mt-2">
            <input type="text" value={editedContent} onChange={e => setEditedContent(e.target.value)} className="w-full border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex justify-end mt-2 space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save
              </button>
            </div>
          </div> : <p className="text-sm text-gray-800 mt-1">{comment.content}</p>}
      </div>
    </div>;
};
export default CommentItem;