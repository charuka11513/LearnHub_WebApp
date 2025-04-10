import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
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
const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Mock API call to fetch videos
    const fetchVideos = async () => {
      try {
        // This would be an API call in a real app
        setTimeout(() => {
          const mockVideos = [{
            id: '1',
            title: 'HTML Basics Tutorial',
            description: 'Learn the fundamentals of HTML in this beginner-friendly tutorial.',
            url: 'https://www.example.com/video1',
            thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            userName: 'John Doe',
            userAvatar: 'https://i.pravatar.cc/150?u=john'
          }, {
            id: '2',
            title: 'CSS Flexbox Layout',
            description: 'Master CSS Flexbox for modern web layouts.',
            url: 'https://www.example.com/video2',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            userName: 'Jane Smith',
            userAvatar: 'https://i.pravatar.cc/150?u=jane'
          }, {
            id: '3',
            title: 'JavaScript for Beginners',
            description: 'Start your journey with JavaScript programming.',
            url: 'https://www.example.com/video3',
            thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            userName: 'Alex Johnson',
            userAvatar: 'https://i.pravatar.cc/150?u=alex'
          }];
          setVideos(mockVideos);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);
  return <div>
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon size={18} className="mr-1" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">All Videos</h1>
      </div>
      {loading ? <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative pb-[56.25%]">
                <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {video.description}
                </p>
                <div className="flex items-center">
                  <img src={video.userAvatar} alt={video.userName} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-sm text-gray-700">
                    {video.userName}
                  </span>
                </div>
              </div>
            </div>)}
        </div>}
    </div>;
};
export default VideoPage;