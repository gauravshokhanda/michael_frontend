import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditBlogModal from './EditBlogModal'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const BlogTable = ({ refreshTable }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);


  const fetchBlogs = () => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/blogs/')
      .then((response) => {
        const blogData = response.data.data;

        const newRows = blogData.map((blog, index) => ({
          id: blog._id,
          serialNumber: index + 1,
          title: blog.title,
          content: blog.content,
          author: blog.author,
          tags: blog.tags.join(', '),
          published: blog.published ? 'Yes' : 'No',
          image: blog.image,
          createdAt: new Date(blog.createdAt).toLocaleDateString(),
          updatedAt: new Date(blog.updatedAt).toLocaleDateString(),
        }));

        setRows(newRows);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };
  const handleDelete = async (id) => {
    try {
      // Send DELETE request to the API
      const token = localStorage.getItem('accessToken'); // Retrieve token for authentication if required
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if needed
        },
      });

      // Refresh the table after successful deletion
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentBlog(response.data.data); // Set the fetched blog data
      setEditModalOpen(true); // Open the edit modal
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };
  const handleBlogUpdated = (updatedBlog) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === updatedBlog.id ? updatedBlog : row)));
    setEditModalOpen(false); // Close the modal
  };



  useEffect(() => {
    fetchBlogs();
  }, [refreshTable, editModalOpen]); 

  if (loading) {
    return <Typography variant="h6" align="center">Loading data...</Typography>;
  }

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={[
          { field: 'serialNumber', headerName: 'S.No', flex: 0.1, minWidth: 100 },
          { field: 'author', headerName: 'Author', flex: 0.1, minWidth: 100 },
          {
            field: 'image',
            headerName: 'Image',
            flex: 0.2,
            minWidth: 150,
            renderCell: ({ row }) => (
              row.image ? (
                <img
                  src={row.image}
                  alt="Blog"
                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="body2">No Image</Typography>
              )
            ),
          },
          { field: 'title', headerName: 'Title', flex: 0.25, minWidth: 200 },
          { field: 'content', headerName: 'Content', flex: 0.4, minWidth: 250 },
          { field: 'tags', headerName: 'Tags', flex: 0.2, minWidth: 150 },
          { field: 'published', headerName: 'Published', flex: 0.1, minWidth: 50 },
         
         
          {
            field: 'Action',
            headerName: 'Action',
            flex: 0.3,
            minWidth: 200,
            renderCell: ({ row }) => (
              <>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(row.id)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },

        ]}
        autoHeight
        hideFooter
        disableSelectionOnClick
      />
      {editModalOpen && currentBlog && (
        <EditBlogModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          blog={currentBlog}
          onBlogUpdated={handleBlogUpdated}
        />
      )}
    </Card>
  );
};

export default BlogTable;
