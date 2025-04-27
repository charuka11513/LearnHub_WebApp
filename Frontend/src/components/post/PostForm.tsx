import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ImageIcon, X as XIcon } from 'lucide-react';
import { Post } from '../../types/Post';

// Define avatar URLs and getAvatarUrl function
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

interface PostFormProps {
  onAddPost: (post: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onAddPost }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setImage(newFile);
      setPreview(URL.createObjectURL(newFile));
      setError('');
    }
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      setError('Please add content or an image.');
      return;
    }
    if (!user) {
      setError('You must be logged in to post.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('userName', user.name);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      // Log FormData
      for (const [key, value] of formData.entries()) {
        console.log(`FormData: ${key}=${typeof value === 'string' ? value : '[File]'}`);
      }

      const headers: HeadersInit = {};
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      console.log('Response Status:', response.status);
      console.log('Response Status Text:', response.statusText);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const text = await response.text();
        console.log('Response Body (raw):', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: Non-JSON response`);
        }
      }

      const newPost: Post = await response.json();
      console.log('New Post:', newPost);
      onAddPost(newPost);
      setContent('');
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      setError(error.message || 'Failed to create post.');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <img
            src={getAvatarUrl(user?.id || '')}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            {error && (
              <div className="mb-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your knowledge or ask a question..."
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              rows={3}
              disabled={loading}
            ></textarea>
            {preview && (
              <div className="mt-2 relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-xs h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={loading}
                >
                  <XIcon size={16} />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                <ImageIcon size={20} />
                <span>Add Photo</span>
              </button>
              <button
                type="submit"
                disabled={loading || (!content.trim() && !image)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;