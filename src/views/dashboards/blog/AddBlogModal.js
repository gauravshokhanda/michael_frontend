// src/components/AddBlogModal.js
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const AddBlogModal = ({ open, onClose, onBlogAdded }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !author.trim()) {
            setError('All fields (Title, Content, Author) are required.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Create form data for the request
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('tags', tags.split(',').map(tag => tag.trim())); // Convert tags to an array
            formData.append('author', author);
            if (image) {
                formData.append('image', image); // Append the image file
            }

            const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
            console.log('Token:', token);

            const response = await axios.post('http://localhost:5000/api/blogs/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("formData", formData);

            if (response.data.success) {
                onBlogAdded(response.data.data);
                setTitle('');
                setContent('');
                setTags('');
                setAuthor('');
                setImage(null);

                onClose(); // Close the modal after adding the blog
            } else {
                setError(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error adding blog:', error);
            setError('An error occurred while adding the blog.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Blog</DialogTitle>
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
                <Button
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2 }}
                >
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Button>
                {image && <Typography sx={{ mt: 1 }}>{image.name}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Blog'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBlogModal;
