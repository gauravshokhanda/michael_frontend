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
    Grid
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import ContactForm from "./ContactForm.js";
import axios from "axios";

const ContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Fetch all contacts
    const fetchContacts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/contacts");
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
        try {
            if (editingContact) {
                // Update contact
                await axios.put(`http://localhost:5000/api/contacts/${editingContact._id}`, data);
            } else {
                // Create new contact
                await axios.post("http://localhost:5000/api/contacts", data);
            }
            setEditingContact(null);
            setModalOpen(false);
            fetchContacts();
        } catch (error) {
            console.error("Error submitting contact:", error);
        }
    };

    // Handle delete contact
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/contacts/${id}`);
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Contact List
            </Typography>

            {/* Button to open modal */}
            <Grid item xs={11} lg={11} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: "10px" }}>
                <Button variant="contained" onClick={() => {
                    setEditingContact(null); // Reset the form if in edit mode
                    setModalOpen(true);
                }}>Create New Contact</Button>
            </Grid>

            {/* Table to display contacts */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Number</TableCell>
                            <TableCell>Subject</TableCell>
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
                                    onClick={() => handleDelete(contact._id)}>
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
                    <ContactForm initialData={editingContact} onSubmit={handleSubmit} />
                </Box>
            </Modal>
        </Box>
    );
};

export default ContactPage;
