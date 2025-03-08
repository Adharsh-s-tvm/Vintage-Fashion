import React, { useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import {
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TablePagination,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import { ExpandMore, Search, Add } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#3f51b5",
          borderRadius: 2,
          padding: 2,
          marginBottom: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: "bold" }}>
          Products Management
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4caf50", color: "white" }}
          onClick={() => setShowProductModal(true)}
        >
          Add New Product
        </Button>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search products..."
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 1,
            width: "250px",
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: "#3f51b5" },
              '&:hover fieldset': { borderColor: "#3f51b5" },
              '&.Mui-focused fieldset': { borderColor: "#3f51b5" },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Product List with Accordions */}
      <Accordion sx={{ mb: 2, boxShadow: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ backgroundColor: "#ffffff" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
            Product Name
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "#fafafa" }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: "#4caf50", color: "white" }}
            onClick={() => setShowVariantModal(true)}
          >
            Add Variant
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <TablePagination
          component="div"
          count={100}
          page={0}
          rowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar open={false} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success">Action successful</Alert>
      </Snackbar>

      {/* Add Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField fullWidth label="Product Name" margin="normal" />
          <TextField fullWidth label="Category" margin="normal" />
          <TextField fullWidth label="Brand" margin="normal" />
          <TextField fullWidth label="Description" margin="normal" multiline rows={3} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Close
          </Button>
          <Button variant="primary">Save Product</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Variant Modal */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product Variant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField fullWidth label="Size" margin="normal" />
          <TextField fullWidth label="Color" margin="normal" />
          <TextField fullWidth label="Stock" type="number" margin="normal" />
          <TextField fullWidth label="Price" type="number" margin="normal" />
          <TextField fullWidth label="Main Image URL" margin="normal" />
          <TextField fullWidth label="Additional Image URLs" margin="normal" multiline rows={2} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantModal(false)}>
            Close
          </Button>
          <Button variant="primary">Save Variant</Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};

export default Products;
