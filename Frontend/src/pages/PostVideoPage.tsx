import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, UploadIcon, Trash2Icon, EditIcon, BookOpenIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Video {
  id: string;
  title: string;
  description: string;
  videoData: string; // Base64-encoded video
  thumbnailData: string; // Base64-encoded thumbnail
  createdAt: string;
  userName: string;
  userId: string;
}

interface Post {
  id: string;
  content: string;
  userName: string;
  imageId?: string; // GridFS image ID
}

const PostVideoPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState<string | null>(null); // Track video ID for update
  // Form state for upload
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // Form state for update
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateVideoFile, setUpdateVideoFile] = useState<File | null>(null);
  const [updateThumbnailFile, setUpdateThumbnailFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPostAndVideos = async () => {
      try {
        // Fetch post
        const postResponse = await fetch(`http://localhost:8080/api/posts/${postId}`);
        if (!postResponse.ok) {
          throw new Error(`Failed to fetch post: ${postResponse.status}`);
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch videos
        const videosResponse = await fetch(`http://localhost:8080/api/videos/post/${postId}`);
        if (!videosResponse.ok) {
          throw new Error(`Failed to fetch videos: ${videosResponse.status}`);
        }
        const videosData = await videosResponse.json();
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching post and videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndVideos();
  }, [postId]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleUpdateVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUpdateVideoFile(e.target.files[0]);
    }
  };

  const handleUpdateThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUpdateThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoFile || !thumbnailFile) {
      alert('Please provide a title, video, and thumbnail');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('postId', postId || '');
      formData.append('userId', user?.id || '');
      formData.append('userName', user?.name || '');
      formData.append('title', title);
      formData.append('description', description);
      formData.append('video', videoFile);
      formData.append('thumbnail', thumbnailFile);

      const response = await fetch('http://localhost:8080/api/videos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload video: ${response.status}`);
      }

      const newVideo = await response.json();
      setVideos([newVideo, ...videos]);
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent, videoId: string) => {
    e.preventDefault();
    if (!updateTitle.trim()) {
      alert('Please provide a title');
      return;
    }
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('userId', user?.id || '');
      formData.append('title', updateTitle);
      formData.append('description', updateDescription);
      if (updateVideoFile) {
        formData.append('video', updateVideoFile);
      }
      if (updateThumbnailFile) {
        formData.append('thumbnail', updateThumbnailFile);
      }

      const response = await fetch(`http://localhost:8080/api/videos/${videoId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update video: ${response.status}`);
      }

      const updatedVideo = await response.json();
      setVideos(videos.map(v => v.id === videoId ? updatedVideo : v));
      setShowUpdateForm(null);
      setUpdateTitle('');
      setUpdateDescription('');
      setUpdateVideoFile(null);
      setUpdateThumbnailFile(null);
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/videos/${videoId}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.status}`);
      }

      setVideos(videos.filter(v => v.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon size={18} className="mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>
      {post && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Videos for Post: "
            {post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content}
            "
          </h1>
          <p className="text-gray-600">Posted by {post.userName}</p>
          {post.imageId && (
            <img
              src={`http://localhost:8080/api/posts/image/${post.imageId}`}
              alt="Post image"
              className="mt-4 w-full h-48 object-cover rounded-md"
            />
          )}
        </div>
      )}
      <div className="mb-6">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <UploadIcon size={18} className="mr-2" />
          {showUploadForm ? 'Cancel Upload' : 'Upload Video'}
        </button>
      </div>
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload a New Video</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                  Video File *
                </label>
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image *
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading || !title.trim() || !videoFile || !thumbnailFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {showUpdateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Update Video</h2>
          <form onSubmit={(e) => handleUpdateSubmit(e, showUpdateForm)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="updateTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="updateTitle"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="updateDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="updateDescription"
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="updateVideo" className="block text-sm font-medium text-gray-700 mb-1">
                  Video File (optional)
                </label>
                <input
                  type="file"
                  id="updateVideo"
                  accept="video/*"
                  onChange={handleUpdateVideoFileChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="updateThumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image (optional)
                </label>
                <input
                  type="file"
                  id="updateThumbnail"
                  accept="image/*"
                  onChange={handleUpdateThumbnailFileChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  disabled={updating || !updateTitle.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Video'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No videos yet. Upload one to get started!</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative pb-[56.25%]">
                {video.thumbnailData ? (
                  <img
                    src={`data:image/jpeg;base64,${video.thumbnailData}`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Thumbnail</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                <div className="flex items-center mb-3">
                  <span className="text-sm text-gray-700">{video.userName}</span>
                </div>
                {video.videoData && (
                  <video controls className="w-full rounded-md mb-3">
                    <source src={`data:video/mp4;base64,${video.videoData}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="flex space-x-2">
                  <Link
                    to={`/video/${video.id}/quizzes`}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <BookOpenIcon size={16} className="mr-1" />
                    Quizzes
                  </Link>
                  {user?.id === video.userId && (
                    <>
                      <button
                        onClick={() => {
                          setShowUpdateForm(video.id);
                          setUpdateTitle(video.title);
                          setUpdateDescription(video.description || '');
                        }}
                        className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                      >
                        <EditIcon size={16} className="mr-1" />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <Trash2Icon size={16} className="mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostVideoPage;