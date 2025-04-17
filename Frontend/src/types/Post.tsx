import React from 'react';
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  avatarUrl?: string;
}
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string; // Optional, not in backend but used in PostCard
  content: string;
  createdAt: string;
  likes: number;
  imageId?: string; // GridFS file ID
  comments: any[];
  avatarUrl?: string;
}

export interface PostImage {
  id: string;
  url: string;
}