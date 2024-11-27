import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const ContactForm = ({ initialData = {}, onSubmit, errors = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "", // Safe default value handling
        email: initialData?.email || "",
        number: initialData?.number || "",
        subject: initialData?.subject || "",
        message: initialData?.message || "",
        resolved: initialData?.resolved || false, // Default to false for new contacts
    });

    useEffect(() => {
        if (initialData && initialData._id) {
            // If initialData changes (e.g., when editing an existing contact), update formData
            setFormData({
                name: initialData?.name || "",
                email: initialData?.email || "",
                number: initialData?.number || "",
                subject: initialData?.subject || "",
                message: initialData?.message || "",
                resolved: initialData?.resolved || false,
            });
        }
    }, [initialData]); // Re-run if initialData changes (like when editing a contact)

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
                {initialData?._id ? "Update Contact" : "Create New Contact"}
            </Typography>
            <TextField
                label="Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                label="Number"
                name="number"
                type="tel"
                fullWidth
                value={formData.number}
                onChange={handleChange}
                error={!!errors.number}
                helperText={errors.number}
            />
            <TextField
                label="Subject"
                name="subject"
                fullWidth
                value={formData.subject}
                onChange={handleChange}
                error={!!errors.subject}
                helperText={errors.subject}
            />
            <TextField
                label="Message"
                name="message"
                multiline
                rows={4}
                fullWidth
                value={formData.message}
                onChange={handleChange}
                error={!!errors.message}
                helperText={errors.message}
            />
            {/* Resolved Select Field */}
            <FormControl fullWidth error={!!errors.resolved}>
                <InputLabel id="resolved-select-label">Resolved</InputLabel>
                <Select
                    labelId="resolved-select-label"
                    name="resolved"
                    value={formData.resolved}
                    onChange={(e) => handleChange({ target: { name: "resolved", value: e.target.value === "true" } })}
                >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                </Select>
                {errors.resolved && <Typography variant="caption" color="error">{errors.resolved}</Typography>}
            </FormControl>
            <Button variant="contained" color="primary" type="submit" fullWidth>
                {initialData?._id ? "Update" : "Submit"}
            </Button>
        </Box>
    );
};

export default ContactForm;
