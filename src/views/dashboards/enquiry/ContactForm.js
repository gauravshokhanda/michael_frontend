import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const ContactForm = ({ initialData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "", // Safe default value handling
        email: initialData?.email || "",
        number: initialData?.number || "",
        subject: initialData?.subject || "",
        message: initialData?.message || "",
    });

    useEffect(() => {
        if (initialData && initialData._id) {
            // If initialData changes (e.g. when editing an existing contact), update formData
            setFormData({
                name: initialData?.name || "",
                email: initialData?.email || "",
                number: initialData?.number || "",
                subject: initialData?.subject || "",
                message: initialData?.message || "",
            });
        }
    }, [initialData]); // Re-run if initialData changes (like when editing a contact)

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
            }}
        >
            <Typography variant="h6" textAlign="center" gutterBottom>
                {initialData?._id ? "Update Contact" : "Create New Contact"}
            </Typography>
            <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
            />
            <TextField
                label="Number"
                name="number"
                type="tel"
                fullWidth
                required
                value={formData.number}
                onChange={handleChange}
            />
            <TextField
                label="Subject"
                name="subject"
                fullWidth
                required
                value={formData.subject}
                onChange={handleChange}
            />
            <TextField
                label="Message"
                name="message"
                multiline
                rows={4}
                fullWidth
                required
                value={formData.message}
                onChange={handleChange}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
                {initialData?._id ? "Update" : "Submit"}
            </Button>
        </Box>
    );
};

export default ContactForm;
