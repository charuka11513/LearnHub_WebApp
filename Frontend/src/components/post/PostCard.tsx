import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUpIcon, MessageCircleIcon, TrashIcon, EditIcon, VideoIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from '../comment/CommentSection';
import { formatDate } from '../../utils/dateUtils';
import { Post } from '../../types/Post';

interface PostCardProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: any) => void;
  onUpdateComment: (postId: string, commentId: string, content: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
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
  if (!userId) return avatarUrls[0];
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarUrls[hash % avatarUrls.length];
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onUpdate,
  onDelete,
  onLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);
  const isCurrentUserPost = user?.id === post.userId;

  const handleUpdate = async () => {
    if (!editedContent.trim()) {
      alert('Post content cannot be empty');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: post.userId,
          content: editedContent,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      const updatedPost = await response.json();
      onUpdate({ ...updatedPost, avatarUrl: post.avatarUrl || getAvatarUrl(post.userId) });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: post.userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      onLike(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start space-x-3">
        <img
          src={post.avatarUrl || getAvatarUrl(post.userId)}
          alt={post.userName || 'User'}
          className="w-8 h-8 rounded-full object-cover" 
          onError={(e) => {
            e.currentTarget.src = avatarUrls[0];
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">{post.userName}</h3>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            {isCurrentUserPost && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-500 hover:text-blue-600">
                  <EditIcon size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-red-600"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              ></textarea>
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
            <>
              <p className="mt-2 text-gray-800">{post.content}</p>
              {post.imageId && (
                <div className="mt-3">
                  <img
                    src={`http://localhost:8080/api/posts/image/${post.imageId}`}
                    alt="Post image"
                    className="w-full max-h-[500px] object-cover rounded-md"
                  />
                </div>
              )}
            </>
          )}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <ThumbsUpIcon size={18} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <MessageCircleIcon size={18} />
              <span>{post.comments.length}</span>
            </button>
            <Link
              to={`/post/${post.id}/videos`}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <VideoIcon size={18} />
              <span>Videos</span>
            </Link>
          </div>
          {showComments && (
            <CommentSection
              postId={post.id}
              comments={post.comments}
              onAddComment={onAddComment}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;