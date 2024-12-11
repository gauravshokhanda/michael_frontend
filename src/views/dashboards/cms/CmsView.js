import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Container, Card, Grid } from '@mui/material';
import CMSContentModal from './CMSContentModal';
import EditCMSContentModal from './EditCMSContentModal';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../axiosInstance/axiosInstance';

const CMSContentTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [pages, setPages] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const [text, setText] = useState('');
    const [status, setStatus] = useState('Active');
    const [editRowId, setEditRowId] = useState(null);
    const [editRowSlug, setEditRowSlug] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch pages for dropdown
    const fetchPages = async () => {
        try {
            const response = await axiosInstance.get('/menus');
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };

    // Fetch content for the table
    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/contents');
            const contentData = response.data;

            const formattedRows = contentData.map((content, index) => ({
                id: content._id,
                serialNumber: index + 1,
                slug: content.slug,
                body: content.body,
                status: content.status,
            }));

            setRows(formattedRows);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
        fetchContent();
    }, []);

    // Add Modal Handlers
    const handleOpenAddModal = () => {
        setSelectedPages([]);
        setText('');
        setStatus('Active');
        setAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };

    const handleAddSubmit = async () => {
        let isValid = true;
        let errors = {};

        // Validation checks
        if (!selectedPages.length) {
            errors.pages = 'Please select at least one page.';
            isValid = false;
        }

        if (!text.trim()) {
            errors.body = 'Body cannot be empty.';
            isValid = false;
        }

        if (!status) {
            errors.status = 'Please select a status.';
            isValid = false;
        }

        if (!isValid) {
            setErrorMessage(errors);
            
return;
        }

        const requestData = selectedPages.map((page) => ({
            slug: page,
            body: text,
            status,
        }));

        try {
            await Promise.all(
                requestData.map((data) =>
                    axiosInstance.post('/contents', data)
                )
            );
            alert('Content added successfully!');
            fetchContent();
            setErrorMessage({}); // Clear errors
            handleCloseAddModal();
        } catch (error) {
            console.error('Error adding content:', error);
            setErrorMessage({ general: 'Failed to add content. Please try again.' });
        }
    };

    const handleOpenEditModal = (row) => {
        setEditRowSlug(row.slug); // Save the slug for the selected row
        setText(row.body);
        setStatus(row.status);
        setEditModalOpen(true);
    };

    const handleDelete = async (slug) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this content? This action cannot be undone.'
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axiosInstance.delete(`/contents/${slug}`);
            fetchContent();
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('Failed to delete content. Please try again.');
        }
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleEditSubmit = async () => {
        let isValid = true;
        let errors = {};

        if (!text.trim()) {
            errors.body = 'Body cannot be empty.';
            isValid = false;
        }

        if (!status) {
            errors.status = 'Please select a status.';
            isValid = false;
        }

        if (!isValid) {
            setErrorMessage(errors);
            
return;
        }

        try {
            await axiosInstance.put(`/contents/${editRowSlug}`, {
                body: text,
                status,
            });

            alert('Content updated successfully!');
            fetchContent();
            setErrorMessage({}); // Clear errors
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating content:', error);
            setErrorMessage({ general: 'Failed to update content. Please try again.' });
        }
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Grid item xs={11} lg={11} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Button variant="contained" onClick={handleOpenAddModal}>Add New CMS Content</Button>
            </Grid>
            <Card>
                <DataGrid
                    rows={rows}
                    loading={loading}
                    columns={[
                        { field: 'serialNumber', headerName: 'S.No', flex: 0.1, minWidth: 80 },
                        { field: 'slug', headerName: 'Slug', flex: 0.3, minWidth: 150 },
                        { field: 'body', headerName: 'Body', flex: 0.5, minWidth: 300 },
                        { field: 'status', headerName: 'Status', flex: 0.2, minWidth: 120 },
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            flex: 0.2,
                            minWidth: 150,
                            renderCell: (params) => (
                                <>
                                    <IconButton color="primary" onClick={() => handleOpenEditModal(params.row)} sx={{ mr: 1 }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(params.row.slug)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            ),
                        },
                    ]}
                    autoHeight
                    disableSelectionOnClick
                />
            </Card>

            <CMSContentModal
                open={addModalOpen}
                handleClose={handleCloseAddModal}
                handleSubmit={handleAddSubmit}
                pages={pages}
                selectedPages={selectedPages}
                setSelectedPages={setSelectedPages}
                text={text}
                setText={setText}
                status={status}
                setStatus={setStatus}
                errorMessage={errorMessage}
            />

            <EditCMSContentModal
                open={editModalOpen}
                handleClose={handleCloseEditModal}
                handleEditSubmit={handleEditSubmit}
                text={text}
                setText={setText}
                status={status}
                setStatus={setStatus}
                errorMessage={errorMessage}
            />
        </Container>
    );
};

export default CMSContentTable;
