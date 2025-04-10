import React from 'react';
import PostCard from './PostCard';
import { Post } from '../../types/Post';
interface PostListProps {
  posts: Post[];
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, comment: any) => void;
  onUpdateComment: (postId: string, commentId: string, content: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}
const PostList: React.FC<PostListProps> = ({
  posts,
  onUpdatePost,
  onDeletePost,
  onLikePost,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  if (posts.length === 0) {
    return <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No posts yet. Be the first to share!</p>
      </div>;
  }
  return <div className="space-y-4">
      {posts.map(post => <PostCard key={post.id} post={post} onUpdate={onUpdatePost} onDelete={onDeletePost} onLike={onLikePost} onAddComment={onAddComment} onUpdateComment={onUpdateComment} onDeleteComment={onDeleteComment} />)}
    </div>;
};
export default PostList;