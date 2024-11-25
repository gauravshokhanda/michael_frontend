import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const AddMenuModal = ({ open, onClose, onSave }) => {
    const [menuData, setMenuData] = useState({ name: '', link: '', sortOrder: '' });

    const handleInputChange = (field, value) => {
        setMenuData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(menuData);
        setMenuData({ name: '', link: '', sortOrder: '' }); // Reset form
    };

    return (
        <Modal open={open} onClose={onClose}>
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
                    Add New Menu
                </Typography>
                <TextField
                    fullWidth
                    label="Menu Name"
                    value={menuData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Link"
                    value={menuData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Sort Order"
                    value={menuData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddMenuModal;
