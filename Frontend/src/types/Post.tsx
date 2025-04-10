import React from 'react';
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  images: PostImage[];
}
export interface PostImage {
  id: string;
  url: string;
}