import React from 'react';
import PostCard from './PostCard';
import { Post } from '../../types/Post';

interface PostListProps {
  posts: Post[];
  onUpdatePost: (updatedPost: Post) => void;
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
  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={onUpdatePost}
            onDelete={onDeletePost}
            onLike={onLikePost}
            onAddComment={onAddComment}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
          />
        ))
      )}
    </div>
  );
};

export default PostList;