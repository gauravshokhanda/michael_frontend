import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FormControl, TextField, Button, Container, Typography, Autocomplete, Chip, Box } from '@mui/material';
// import CustomEditor from "./CustomEditor";

const PageNameDropdown = () => {
    const [pages, setPages] = useState([]); // State to store page names
    const [selectedPages, setSelectedPages] = useState([]); // State for selected pages
    const [text, setText] = useState(''); // State to store input message
    const [status, setStatus] = useState('Active'); // State to store selected status

    // Fetch page names from API
    const fetchPages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menus/');
            console.log(response);
            setPages(response.data.map((page) => page.name)); // Assuming the response contains an array of page objects
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };

    useEffect(() => {
        fetchPages(); // Fetch data when the component mounts
    }, []);

    // Handle text field change
    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    // Handle status dropdown change
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    // Handle submit button click
    const handleSubmit = () => {
        console.log('Selected Pages:', selectedPages);
        console.log('Message:', text);
        console.log('Status:', status);
        // You can handle form submission logic here, e.g., send data to an API
    };

    return (
        <Container
            sx={{
                backgroundColor: 'white',
                boxShadow: 3,
                padding: 4,
                borderRadius: 2,
                maxWidth: 800,
                marginTop: 4,
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold', }}>
                CMS Page
            </Typography>
            <FormControl fullWidth>
                <Autocomplete
                    multiple
                    options={pages}
                    value={selectedPages}
                    onChange={(event, newValue) => setSelectedPages(newValue)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                key={option}
                                label={option}
                                {...getTagProps({ index })}
                                sx={{ margin: 0.5 }}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select Pages"
                            placeholder="Choose pages"
                            sx={{ width: '90%', marginBottom: 2 }}
                        />
                    )}
                />
                <TextField
                    sx={{ width: '90%', marginBottom: 2 }}
                    label="Your Message"
                    multiline
                    rows={4}
                    value={text}
                    onChange={handleTextChange}
                    fullWidth
                    variant="outlined"
                />
                <FormControl fullWidth margin="normal">
                    <TextField
                        select
                        label="Status"
                        value={status}
                        onChange={handleStatusChange}
                        sx={{ width: '60%', marginBottom: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </TextField>
                </FormControl>
                <Button
                    sx={{ width: '10%', padding: '10px', fontSize: '16px' }}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                {/* <CustomEditor/> */}
            </FormControl>
        </Container>
    );
};

export default PageNameDropdown;
