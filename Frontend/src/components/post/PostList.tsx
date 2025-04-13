import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { Post } from '../../types/Post';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/posts', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch posts');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleUpdate = (updatedPost: Post) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + 1 } : p
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleAddComment = (postId: string, comment: any) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  const handleUpdateComment = (postId: string, commentId: string, content: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment: any) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
          : post
      )
    );
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((comment: any) => comment.id !== commentId),
            }
          : post
      )
    );
  };

  if (loading) {
    return <div className="text-center p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        ))
      )}
    </div>
  );
};

export default PostList;