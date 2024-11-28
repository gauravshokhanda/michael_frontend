import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditBlogModal from './EditBlogModal';

const BlogTable = ({ refreshTable }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [blogToDelete, setBlogToDelete] = useState(null); // Blog ID to delete

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
          published: blog.published,
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

  const confirmDelete = (id) => {
    setBlogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/blogs/${blogToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBlogs(); // Refresh the table
      setDeleteDialogOpen(false); // Close confirmation dialog
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
      setCurrentBlog(response.data.data);
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };

  const handleBlogUpdated = (updatedBlog) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedBlog.id ? updatedBlog : row))
    );
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
            renderCell: ({ row }) =>
              row.image ? (
                <img
                  src={row.image}
                  alt="Blog"
                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="body2">No Image</Typography>
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
                  onClick={() => confirmDelete(row.id)}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BlogTable;
