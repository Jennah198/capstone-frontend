import React, { useState, useEffect } from 'react';
import {
    FaImages, FaPlus, FaTrash, FaSpinner, FaSearch,
    FaTimes, FaCloudUploadAlt, FaVideo, FaImage
} from 'react-icons/fa';
import { useEventContext } from '../../context/EventContext';
import { toastError, toastSuccess } from '../../../utility/toast';

interface Media {
    _id: string;
    title: string;
    description?: string;
    url: string;
    type: 'image' | 'video';
    createdAt: string;
}

const AdminMedia: React.FC = () => {
    const { getMedia, createMedia, deleteMedia } = useEventContext();
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'image' | 'video'>('image');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await getMedia();
            if (res.success) {
                setMediaList(res.media);
            }
        } catch (error) {
            toastError('Failed to fetch media');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setType('image');
        setFile(null);
        setFilePreview(null);
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !file) return toastError('Title and file are required');

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('media', file);

        try {
            const res = await createMedia(formData);
            if (res.success) {
                toastSuccess('Media uploaded successfully');
                fetchMedia();
                resetForm();
            }
        } catch (error: any) {
            toastError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this media item?')) return;

        try {
            const res = await deleteMedia(id);
            if (res.success) {
                toastSuccess('Media deleted successfully');
                setMediaList(mediaList.filter(m => m._id !== id));
            }
        } catch (error) {
            toastError('Failed to delete media');
        }
    };

    const filteredMedia = mediaList.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-64 p-8 pt-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <FaImages className="text-green-600" />
                            Manage Media
                        </h1>
                        <p className="text-gray-600 mt-2">Upload images and videos for the homepage gallery</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
                    >
                        <FaPlus />
                        Upload Media
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
                    <FaSearch className="text-gray-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="flex-1 outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
                        <p className="text-gray-500 font-medium">Loading gallery...</p>
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                        <h3 className="text-xl font-bold text-gray-700">Gallery is empty</h3>
                        <p className="text-gray-500 mt-2">Start uploading some cool photos or videos!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMedia.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 relative group">
                                <div className="h-48 bg-gray-100 relative">
                                    {item.type === 'image' ? (
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <FaVideo className="text-4xl text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{item.type.toUpperCase()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Upload New Media</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 outline-none">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Give your media a title" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setType('image')} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition ${type === 'image' ? 'bg-green-50 border-green-500 text-green-600' : 'border-gray-200 text-gray-500'}`}>
                                            <FaImage /> Image
                                        </button>
                                        <button type="button" onClick={() => setType('video')} className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition ${type === 'video' ? 'bg-green-50 border-green-500 text-green-600' : 'border-gray-200 text-gray-500'}`}>
                                            <FaVideo /> Video
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload File</label>
                                    <div className="relative group w-full h-48 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden bg-gray-50">
                                        {filePreview ? (
                                            type === 'image' ? (
                                                <img src={filePreview} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <FaVideo className="text-3xl text-green-500" />
                                                    <span className="text-sm font-medium">{file?.name}</span>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <FaCloudUploadAlt className="text-4xl text-gray-300 group-hover:text-green-500 transition" />
                                                <span className="text-sm text-gray-500 font-medium">Click to select file</span>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} required />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-opacity disabled:opacity-50"
                                    >
                                        {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Start Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMedia;
