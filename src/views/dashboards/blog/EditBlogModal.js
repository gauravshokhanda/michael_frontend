import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';
import axios from 'axios';

const EditBlogModal = ({ open, onClose, blog, onBlogUpdated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [published, setPublished] = useState('No');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // Field-specific error state

    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
            setTags(blog.tags.join(', '));
            setAuthor(blog.author);
            setPublished(blog.published);
            setImage(null); // Reset image
            setImagePreview(blog.image || null); // Display current image preview
        }
    }, [blog]);

    const validateFields = () => {
        const fieldErrors = {};

        if (!title.trim()) {
            fieldErrors.title = 'Title is required.';
        }
        if (!content.trim()) {
            fieldErrors.content = 'Content is required.';
        }
        if (!author.trim()) {
            fieldErrors.author = 'Author is required.';
        }
        if (tags && tags.split(',').some((tag) => tag.trim() === '')) {
            fieldErrors.tags = 'Tags must not contain empty values.';
        }
        if (image) {
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
                fieldErrors.image = 'Invalid image format. Only JPEG, PNG, and GIF are allowed.';
            } else if (image.size > 2 * 1024 * 1024) { // Limit size to 2MB
                fieldErrors.image = 'Image size must be less than 2MB.';
            }
        }

        return fieldErrors;
    };

    const handleSubmit = async () => {
        const fieldErrors = validateFields();

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors); // Display errors
            return;
        }

        try {
            setLoading(true);
            setErrors({}); // Clear previous errors

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('tags', tags.split(',').map((tag) => tag.trim()));
            formData.append('author', author);
            formData.append('published', published); // Send "Yes" or "No" directly
            if (image) {
                formData.append('image', image);
            }

            const token = localStorage.getItem('accessToken');
            const response = await axios.put(
                `http://localhost:5000/api/blogs/${blog._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                onBlogUpdated(response.data.data); // Notify parent of the updated blog
                onClose();
            } else {
                setErrors({ form: `Error: ${response.data.message}` });
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            setErrors({ form: 'An error occurred while updating the blog.' });
        } finally {
            setLoading(false);
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogContent>
                {errors.form && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {errors.form}
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
                    error={!!errors.title}
                    helperText={errors.title}
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
                    error={!!errors.content}
                    helperText={errors.content}
                />
                <TextField
                    margin="dense"
                    label="Tags (comma separated)"
                    fullWidth
                    variant="outlined"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    error={!!errors.tags}
                    helperText={errors.tags}
                />
                <TextField
                    margin="dense"
                    label="Author"
                    fullWidth
                    variant="outlined"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    error={!!errors.author}
                    helperText={errors.author}
                />
                <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.published}>
                    <InputLabel>Published</InputLabel>
                    <Select
                        value={published} // This binds the dropdown to the `published` state
                        onChange={(e) => setPublished(e.target.value)}
                        label="Published"
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                    {errors.published && <FormHelperText>{errors.published}</FormHelperText>}
                </FormControl>

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
                {errors.image && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errors.image}
                    </Typography>
                )}
                {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Preview:</Typography>
                        <img
                            src={imagePreview}
                            alt="Selected"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                marginTop: '8px',
                                borderRadius: '4px',
                            }}
                        />
                    </Box>
                )}
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
