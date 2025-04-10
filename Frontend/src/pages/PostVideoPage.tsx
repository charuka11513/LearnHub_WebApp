import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, UploadIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  userName: string;
  userAvatar: string;
}
interface Post {
  id: string;
  content: string;
  userName: string;
}
const PostVideoPage: React.FC = () => {
  const {
    postId
  } = useParams<{
    postId: string;
  }>();
  const {
    user
  } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    // Mock API call to fetch post and its videos
    const fetchPostAndVideos = async () => {
      try {
        // This would be API calls in a real app
        setTimeout(() => {
          // Mock post data
          const mockPost = {
            id: postId || '1',
            content: 'Just created a new tutorial on HTML basics. Check out the video section!',
            userName: 'John Doe'
          };
          // Mock videos data
          const mockVideos = [{
            id: '1',
            title: 'HTML Basics - Part 1',
            description: 'Introduction to HTML tags and structure',
            url: 'https://www.example.com/video1',
            thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            userName: 'John Doe',
            userAvatar: 'https://i.pravatar.cc/150?u=john'
          }, {
            id: '2',
            title: 'HTML Basics - Part 2',
            description: 'Working with forms and inputs',
            url: 'https://www.example.com/video2',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            userName: 'Jane Smith',
            userAvatar: 'https://i.pravatar.cc/150?u=jane'
          }];
          setPost(mockPost);
          setVideos(mockVideos);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching post and videos:', error);
        setLoading(false);
      }
    };
    fetchPostAndVideos();
  }, [postId]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;
    setUploading(true);
    try {
      // This would be an API call in a real app
      // Mock successful upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newVideo = {
        id: Date.now().toString(),
        title,
        description,
        url: 'https://www.example.com/video-new',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        createdAt: new Date().toISOString(),
        userName: user?.name || 'Unknown User',
        userAvatar: user?.avatarUrl || 'https://i.pravatar.cc/150?u=default'
      };
      setVideos([newVideo, ...videos]);
      setTitle('');
      setDescription('');
      setFile(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setUploading(false);
    }
  };
  if (loading) {
    return <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  return <div>
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon size={18} className="mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>
      {post && <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Videos for Post: "
            {post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content}
            "
          </h1>
          <p className="text-gray-600">Posted by {post.userName}</p>
        </div>}
      <div className="mb-6">
        <button onClick={() => setShowUploadForm(!showUploadForm)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <UploadIcon size={18} className="mr-2" />
          {showUploadForm ? 'Cancel Upload' : 'Upload Video'}
        </button>
      </div>
      {showUploadForm && <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload a New Video</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                  Video File *
                </label>
                <input type="file" id="video" accept="video/*" onChange={handleFileChange} required className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={uploading || !title.trim() || !file} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </div>
          </form>
        </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative pb-[56.25%]">
              <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{video.description}</p>
              <div className="flex items-center">
                <img src={video.userAvatar} alt={video.userName} className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-gray-700">{video.userName}</span>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
export default PostVideoPage;