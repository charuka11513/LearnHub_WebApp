import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Comment } from '../../types/Post';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, comment: Comment) => void;
  onUpdateComment: (postId: string, commentId: string, content: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Debug: Log comments received
  console.log(`CommentSection for post ${postId}:`, comments);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    const comment = {
      postId,
      userId: user.id,
      userName: user.name,
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }
      const savedComment = await response.json();
      console.log('Added comment:', savedComment); // Debug
      onAddComment(postId, savedComment);
      setNewComment('');
      setError(null);
      // Refresh comments to ensure new comment displays
      const commentResponse = await fetch(`http://localhost:8080/api/comments/post/${postId}`);
      if (commentResponse.ok) {
        const updatedComments = await commentResponse.json();
        console.log('Refreshed comments:', updatedComments); // Debug
        onAddComment(postId, updatedComments[updatedComments.length - 1]); // Update with latest
      }
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    if (!user) {
      setError('You must be logged in to edit comments');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content: editContent }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update comment: ${response.statusText}`);
      }
      console.log('Updated comment:', { commentId, content: editContent }); // Debug
      onUpdateComment(postId, commentId, editContent);
      setEditingCommentId(null);
      setEditContent('');
      setError(null);
    } catch (err: any) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      setError('You must be logged in to delete comments');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      }
      console.log('Deleted comment:', commentId); // Debug
      onDeleteComment(postId, commentId);
      setError(null);
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };

  // Ensure comments is an array to prevent render errors
  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="mt-4">
      {/* Comment Form */}
      <form onSubmit={handleAddComment} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!newComment.trim() || !user}
        >
          Post Comment
        </button>
      </form>

      {/* Comment List */}
      {safeComments.length > 0 ? (
        safeComments.map((comment) => (
          <div key={comment.id} className="border-t py-2">
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <div className="flex justify-end mt-1 space-x-2">
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={!editContent.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-sm text-gray-500">
                  By {comment.userName} • {new Date(comment.createdAt).toLocaleString()}
                </p>
                {user?.id === comment.userId && (
                  <div className="flex space-x-2 mt-1">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentSection;