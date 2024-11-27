import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Modal,
    Paper,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import ContactForm from "./ContactForm.js";
import axiosInstance from "../axiosInstance/axiosInstance"; // Import the axiosInstance

const ContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
    const [deleteContactId, setDeleteContactId] = useState(null); // Track the ID of the contact to delete

    // Fetch all contacts
    const fetchContacts = async () => {
        try {
            const response = await axiosInstance.get("/contacts");
            console.log("response", response);
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Handle form submission
    const handleSubmit = async (data) => {
        const validationErrors = validateForm(data);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            if (editingContact) {
                await axiosInstance.put(`/contacts/${editingContact._id}`, data);
            } else {
                await axiosInstance.post("/contacts", data);
            }

            setEditingContact(null);
            setModalOpen(false);
            fetchContacts();
        } catch (error) {
            console.error("Error submitting contact:", error);
        }
    };

    const validateForm = (data) => {
        let formErrors = {};

        if (!data.name) formErrors.name = "Name is required";
        if (!data.email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            formErrors.email = "Email is invalid";
        }
        if (!data.number) formErrors.number = "Number is required";
        if (!data.subject) formErrors.subject = "Subject is required";
        if (!data.message) formErrors.message = "Message is required";

        return formErrors;
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (id) => {
        console.log("Delete Dialog Open:", deleteDialogOpen);
        console.log("Contact ID to delete:", deleteContactId);

        setDeleteContactId(id);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteContactId(null);
    };

    // Confirm delete contact
    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/contacts/${deleteContactId}`);
            fetchContacts();
            closeDeleteDialog(); // Close dialog after deletion
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Contact List
            </Typography>

            <Grid item xs={11} lg={11} sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditingContact(null);
                        setModalOpen(true);
                    }}
                >
                    Create New Contact
                </Button>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Number</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Resolved</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact._id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.number}</TableCell>
                                <TableCell>{contact.subject}</TableCell>
                                <TableCell>{contact.resolved ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setEditingContact(contact);
                                            setModalOpen(true);
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => openDeleteDialog(contact._id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for creating/updating contact */}
            <Modal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="contact-modal"
                aria-describedby="modal-for-creating-or-updating-contact"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <ContactForm initialData={editingContact} onSubmit={handleSubmit} errors={errors} />
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this contact? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContactPage;
