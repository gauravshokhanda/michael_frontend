import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const EditMenuModal = ({ open, menu, onClose, onSave, onInputChange }) => {
    const [errors, setErrors] = useState({ name: '', link: '', sortOrder: '' });

    const validate = () => {
        let valid = true;
        const newErrors = { name: '', link: '', sortOrder: '' };

        if (!menu.name.trim()) {
            newErrors.name = 'Menu name is required';
            valid = false;
        }

        if (!menu.link.trim()) {
            newErrors.link = 'Link is required';
            valid = false;
        } else if (!/^\/[^\s]+$/.test(menu.link)) {
            newErrors.link = 'Link must start with / followed by text (e.g., /example)';
            valid = false;
        }

        if (!menu.sortOrder.trim()) {
            newErrors.sortOrder = 'Sort order is required';
            valid = false;
        } else if (isNaN(menu.sortOrder)) {
            newErrors.sortOrder = 'Sort order must be a number';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = () => {
        if (validate()) {
            onSave(menu);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogContent>
                <TextField
                    label="Menu Name"
                    value={menu.name || ''}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    fullWidth
                    margin="dense"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />
                <TextField
                    label="Slug"
                    value={menu.link || ''}
                    onChange={(e) => onInputChange('link', e.target.value)}
                    fullWidth
                    margin="dense"
                    error={Boolean(errors.link)}
                    helperText={errors.link}
                />
                <TextField
                    label="Sort Order"
                    type="number"
                    value={menu.sortOrder || ''}
                    onChange={(e) => onInputChange('sortOrder', e.target.value)}
                    fullWidth
                    margin="dense"
                    error={Boolean(errors.sortOrder)}
                    helperText={errors.sortOrder}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMenuModal;
