import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

const AddMenuModal = ({ open, onClose, onSave }) => {
    const [menuData, setMenuData] = useState({ name: '', link: '', sortOrder: '' });
    const [errors, setErrors] = useState({ name: '', link: '', sortOrder: '' });
    const [maxSortOrder, setMaxSortOrder] = useState(15); // Default limit
    const [usedSortOrders, setUsedSortOrders] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newLimit, setNewLimit] = useState(maxSortOrder);

    useEffect(() => {
        if (open) {
            axios.get('http://localhost:5000/api/menus/used-sort-orders')
                .then((response) => {
                    setUsedSortOrders(response.data.sortOrders);
                })
                .catch((error) => {
                    console.error('Failed to fetch sort orders:', error);
                });
        }
    }, [open]);

    const validate = () => {
        let valid = true;
        const newErrors = { name: '', link: '', sortOrder: '' };

        if (!menuData.name.trim()) {
            newErrors.name = 'Menu name is required';
            valid = false;
        }

        if (!menuData.link.trim()) {
            newErrors.link = 'Link is required';
            valid = false;
        } else if (!/^\/[^\s]+$/.test(menuData.link)) {
            newErrors.link = 'Link must start with / followed by text (e.g., /example)';
            valid = false;
        }

        if (!menuData.sortOrder) {
            newErrors.sortOrder = 'Sort order is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleInputChange = (field, value) => {
        setMenuData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' })); // Clear error when typing
    };

    const handleSave = () => {
        if (validate()) {
            onSave(menuData);
            setMenuData({ name: '', link: '', sortOrder: '' }); // Reset form
            setErrors({ name: '', link: '', sortOrder: '' }); // Reset errors
        }
    };

    const handleSaveNewLimit = () => {
        if (newLimit > 0) {
            setMaxSortOrder(newLimit);
            setOpenEditModal(false);
        } else {
            alert('Limit must be greater than 0');
        }
    };

    const handleOpenEditModal = () => {
        setNewLimit(maxSortOrder);
        setOpenEditModal(true);
    };

    // Close modal
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 28,
                    p: 5,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2} color="primary">
                    Add New Menu
                </Typography>
                <TextField
                    fullWidth
                    label="Menu Name"
                    value={menuData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    margin="normal"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />
                <TextField
                    fullWidth
                    label="Slug"
                    value={menuData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    margin="normal"
                    error={Boolean(errors.link)}
                    helperText={errors.link}
                />
                <FormControl fullWidth margin="normal" error={Boolean(errors.sortOrder)}>
                    <InputLabel id="sort-order-label">Sort Order</InputLabel>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Select
                            labelId="sort-order-label"
                            id="sort-order-label"
                            value={menuData.sortOrder}
                            onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                            fullWidth
                        >
                            {[...Array(maxSortOrder).keys()].map((num) => (
                                <MenuItem
                                    key={num + 1}
                                    value={num + 1}
                                    disabled={usedSortOrders.includes(num + 1)}
                                >
                                    {num + 1}
                                </MenuItem>
                            ))}
                        </Select>
                        <IconButton
                            color="primary"
                            onClick={handleOpenEditModal}
                            sx={{ ml: 1 }} // Slight margin-left for spacing
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                    {errors.sortOrder && (
                        <Typography variant="body2" color="error">
                            {errors.sortOrder}
                        </Typography>
                    )}
                </FormControl>


                {errors.sortOrder && (
                    <Typography variant="body2" color="error">
                        {errors.sortOrder}
                    </Typography>
                )}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
                <Modal open={openEditModal} onClose={handleCloseEditModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h6" mb={2}>
                            Update Sort Order Limit
                        </Typography>
                        <TextField
                            label="New Limit"
                            type="number"
                            value={newLimit}
                            onChange={(e) => setNewLimit(Number(e.target.value))}
                            fullWidth
                            margin="normal"
                        />
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button onClick={handleCloseEditModal} color="secondary" sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveNewLimit} variant="contained" color="primary">
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Modal>
    );
};

export default AddMenuModal;
