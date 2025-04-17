import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

interface Video {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  videoData: string; // Base64-encoded
  thumbnailData: string; // Base64-encoded
  createdAt: string;
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

const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/videos/post/allvideos');
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon size={18} className="mr-1" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">All Videos</h1>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">No videos available.</p>
          ) : (
            videos.map(video => (
              <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <div className="flex items-center mb-3">
                    <img
                      src={getAvatarUrl(video.userId)}
                      alt={video.userName}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = avatarUrls[0];
                      }}
                    />
                    <span className="text-sm text-gray-700">{video.userName}</span>
                  </div>
                  {video.videoData && (
                    <video controls className="w-full rounded-md">
                      <source src={`data:video/mp4;base64,${video.videoData}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPage;