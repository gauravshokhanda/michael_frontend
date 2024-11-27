// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import BlogTable from 'src/views/dashboards/blog/blogTable'
import AddBlogModal from 'src/views/dashboards/blog/AddBlogModal'
import { useState } from 'react';




const EcommerceDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  const handleBlogAdded = () => {
    setRefreshTable((prev) => !prev); // Toggle refresh state
    setOpenModal(false); // Close modal after adding the blog
  };
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} sx={{ order: [1, 1, 1, 0] }}>
          <Grid item xs={11} lg={11} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom:"10px"}}>
            <Button variant="contained" onClick={() => setOpenModal(true)}>Add Blog</Button>
          </Grid>
          <BlogTable refreshTable={refreshTable} />
          <AddBlogModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onBlogAdded={handleBlogAdded}
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard
