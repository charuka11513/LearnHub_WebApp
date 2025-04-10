import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
interface CommentSectionProps {
  postId: string;
  comments: any[];
  onAddComment: (postId: string, comment: any) => void;
  onUpdateComment: (postId: string, commentId: string, content: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}
const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  return <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
      <CommentForm postId={postId} onAddComment={onAddComment} />
      <div className="mt-4 space-y-3">
        {comments.length > 0 ? comments.map(comment => <CommentItem key={comment.id} comment={comment} postId={postId} onUpdateComment={onUpdateComment} onDeleteComment={onDeleteComment} />) : <p className="text-sm text-gray-500">
            No comments yet. Be the first to comment!
          </p>}
      </div>
    </div>;
};
export default CommentSection;