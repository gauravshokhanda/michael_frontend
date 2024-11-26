import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    Autocomplete,
    Chip,
    Button,
    Typography,
} from '@mui/material';

const CMSContentModal = ({
    open,
    handleClose,
    handleSubmit,
    pages,
    selectedPages,
    setSelectedPages,
    text,
    setText,
    status,
    setStatus,
    errorMessage, // Receive errorMessage as a prop
}) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New CMS Content</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    {/* Pages error */}
                    <Autocomplete
                        multiple
                        options={pages.map((page) => page.name)}
                        value={selectedPages}
                        onChange={(event, newValue) => setSelectedPages(newValue || [])}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip key={option} label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Pages"
                                variant="outlined"
                                error={!!errorMessage.pages}
                                helperText={errorMessage.pages || ''}
                            />
                        )}
                        sx={{ marginBottom: 2 }}
                    />
                    {/* Body error */}
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
                    {/* Status error */}
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
                        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
                            {errorMessage.general}
                        </Typography>
                    )}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CMSContentModal;
