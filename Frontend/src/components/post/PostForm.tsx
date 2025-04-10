import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ImageIcon, X as XIcon } from 'lucide-react';
interface PostFormProps {
  onAddPost: (post: any) => void;
}
const PostForm: React.FC<PostFormProps> = ({
  onAddPost
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    user
  } = useAuth();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    setLoading(true);
    try {
      const mockImageUrls = images.map((_, index) => ({
        id: `img-${Date.now()}-${index}`,
        url: previews[index]
      }));
      const newPost = {
        id: Date.now().toString(),
        userId: user?.id,
        userName: user?.name,
        userAvatar: user?.avatarUrl,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        images: mockImageUrls
      };
      await new Promise(resolve => setTimeout(resolve, 500));
      onAddPost(newPost);
      setContent('');
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };
  return <div className="bg-white rounded-lg shadow p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <img src={user?.avatarUrl || 'https://i.pravatar.cc/150?u=default'} alt={user?.name || 'User'} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Share your knowledge or ask a question..." className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
            {previews.length > 0 && <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {previews.map((preview, index) => <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <XIcon size={16} />
                    </button>
                  </div>)}
              </div>}
            <div className="flex items-center justify-between mt-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                <ImageIcon size={20} />
                <span>Add Photos</span>
              </button>
              <button type="submit" disabled={loading || !content.trim() && images.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </div>
        </div>
      </form>
    </div>;
};
export default PostForm;