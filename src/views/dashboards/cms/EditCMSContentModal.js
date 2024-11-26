import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    Button,
    Typography,
} from '@mui/material';

const EditCMSContentModal = ({
    open,
    handleClose,
    handleEditSubmit,
    text,
    setText,
    status,
    setStatus,
    errorMessage,
}) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit CMS Content</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    {/* Body field */}
                    <TextField
                        label="Body"
                        multiline
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        error={!!errorMessage.body}
                        helperText={errorMessage.body || ''}
                    />
                    {/* Status field */}
                    <TextField
                        select
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        sx={{ marginBottom: 2 }}
                        error={!!errorMessage.status}
                        helperText={errorMessage.status || ''}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </TextField>
                    {/* General error */}
                    {errorMessage.general && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errorMessage.general}
                        </Typography>
                    )}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleEditSubmit} color="primary" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCMSContentModal;
