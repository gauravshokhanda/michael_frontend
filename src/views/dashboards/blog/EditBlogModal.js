import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const EditBlogModal = ({ open, onClose, blog, onBlogUpdated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
            setTags(blog.tags.join(', '));
            setAuthor(blog.author);
            setImage(null); // Reset image
        }
    }, [blog]);

    const handleSubmit = async () => {
        
        if (!title.trim() || !content.trim() || !author.trim()) {
            setError('All fields (Title, Content, Author) are required.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('tags', tags.split(',').map((tag) => tag.trim()));
            formData.append('author', author);
            if (image) {
                formData.append('image', image);
            }

            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`http://localhost:5000/api/blogs/${blog._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("blog.id", blog.id)

            if (response.data.success) {
                onBlogUpdated(response.data.data); // Notify parent of the updated blog
            } else {
                setError(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            setError('An error occurred while updating the blog.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogContent>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Content"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Tags (comma separated)"
                    fullWidth
                    variant="outlined"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Author"
                    fullWidth
                    variant="outlined"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {image && <Typography sx={{ mt: 1 }}>{image.name}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Blog'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBlogModal;
