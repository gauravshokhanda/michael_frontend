import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const EditMenuModal = ({ open, menu, onClose, onSave, onInputChange }) => {
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
                />
                <TextField
                    label="Link"
                    value={menu.link || ''}
                    onChange={(e) => onInputChange('link', e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Sort Order"
                    type="number"
                    value={menu.sortOrder || ''}
                    onChange={(e) => onInputChange('sortOrder', e.target.value)}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMenuModal;
