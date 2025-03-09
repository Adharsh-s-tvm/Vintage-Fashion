import React, { useState, useEffect } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse
} from "@mui/material";
import { ExpandMore, Search, Add, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:7000/api/admin';

const Products = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    brand: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantData, setVariantData] = useState({
    size: '',
    color: '',
    stock: '',
    price: '',
    mainImage: null,
    subImages: {}
  });
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState({
    main: null,
    sub1: null,
    sub2: null,
    sub3: null
  });
  const [expandedRows, setExpandedRows] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup preview URLs
      Object.values(imagePreview).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreview]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      console.log('Products data:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products/add`, formData);
      toast.success('Product added successfully');
      setShowProductModal(false);
      setFormData({
        name: '',
        category: '',
        description: '',
        brand: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVariantChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'mainImage' && files[0]) {
      setVariantData(prev => ({
        ...prev,
        mainImage: files[0]
      }));
      setImagePreview(prev => ({
        ...prev,
        main: URL.createObjectURL(files[0])
      }));
    } else if (name.startsWith('subImage')) {
      const index = name.slice(-1);
      if (files[0]) {
        setVariantData(prev => ({
          ...prev,
          subImages: {
            ...prev.subImages,
            [index]: files[0]
          }
        }));
        setImagePreview(prev => ({
          ...prev,
          [`sub${index}`]: URL.createObjectURL(files[0])
        }));
      }
    } else {
      setVariantData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleVariantSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('product', selectedProduct._id);
      formData.append('size', variantData.size);
      formData.append('color', variantData.color);
      formData.append('stock', variantData.stock);
      formData.append('price', variantData.price);
      formData.append('mainImage', variantData.mainImage);

      Object.values(variantData.subImages).forEach(image => {
        formData.append('subImages', image);
      });

      await axios.post(`${API_BASE_URL}/products/variant/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Variant added successfully');
      setShowVariantModal(false);
      setVariantData({
        size: '',
        color: '',
        stock: '',
        price: '',
        mainImage: null,
        subImages: {}
      });
      setImagePreview({
        main: null,
        sub1: null,
        sub2: null,
        sub3: null
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add variant');
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`${API_BASE_URL}/products/${selectedProduct._id}`, formData);
      toast.success('Product updated successfully');
      setShowProductModal(false);
      setEditMode(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleRowExpand = (productId) => {
    setExpandedRows(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleDeleteVariant = async (variantId) => {
    setItemToDelete(variantId);
    setDeleteType('variant');
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteType === 'variant') {
        await axios.delete(`${API_BASE_URL}/products/variant/${itemToDelete}`);
        toast.success('Variant deleted successfully');
      } else if (deleteType === 'product') {
        await axios.delete(`${API_BASE_URL}/products/${itemToDelete}`);
        toast.success('Product deleted successfully');
      }
      fetchProducts();
    } catch (error) {
      toast.error(`Failed to delete ${deleteType}`);
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const handleCloseDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleDeleteProduct = (productId) => {
    setItemToDelete(productId);
    setDeleteType('product');
    setDeleteConfirmOpen(true);
  };

  const DeleteConfirmDialog = ({ open, handleClose, handleConfirm, itemType }) => (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this {itemType}?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

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
          sx={{
            backgroundColor: "#2e7d32", // Dark green
            color: "white",
            '&:hover': {
              backgroundColor: "#1b5e20"
            },
            fontWeight: 'bold',
            boxShadow: 2
          }}
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

      {/* Update Table section */}
      <TableContainer
        component={Paper}
        sx={{
          mb: 2,
          boxShadow: 3,
          borderRadius: 2,
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 8px' // Add spacing between rows
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{
              backgroundColor: "#1a237e",
              '& th': {
                color: "white",
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: '16px',
                borderBottom: 'none'
              },
              '& th:first-of-type': { borderTopLeftRadius: 8 },
              '& th:last-child': { borderTopRightRadius: 8 }
            }}>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
              <TableCell align="center">Variants</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No products found</TableCell>
              </TableRow>
            ) : (
              products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <React.Fragment key={product._id}>
                    <TableRow
                      sx={{
                        backgroundColor: 'white',
                        '&:nth-of-type(odd)': {
                          backgroundColor: '#f8f9fa'
                        },
                        '&:hover': {
                          backgroundColor: '#e8eaf6',
                          transform: 'scale(1.002)',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        },
                        '& td': {
                          padding: '16px',
                          border: 'none'
                        },
                        marginBottom: '8px'
                      }}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {typeof product.category === 'object'
                          ? product.category?.name
                          : categories.find(cat => cat._id === product.category)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {typeof product.brand === 'object'
                          ? product.brand?.name
                          : brands.find(brand => brand._id === product.brand)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center',
                          '& .MuiButton-root': {
                            minWidth: '100px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            boxShadow: 2
                          }
                        }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowVariantModal(true);
                            }}
                            sx={{
                              backgroundColor: "#00796b", // Teal
                              '&:hover': {
                                backgroundColor: "#004d40",
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.2s'
                            }}
                          >
                            Add Variant
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#1565c0", // Blue
                              '&:hover': {
                                backgroundColor: "#0d47a1",
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.2s'
                            }}
                            onClick={() => {
                              setSelectedProduct(product);
                              setFormData({
                                name: product.name,
                                category: product.category._id,
                                brand: product.brand._id,
                                description: product.description
                              });
                              setEditMode(true);
                              setShowProductModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#d32f2f",
                              '&:hover': {
                                backgroundColor: "#b71c1c",
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRowExpand(product._id)}
                          sx={{
                            backgroundColor: expandedRows[product._id] ? '#e3f2fd' : 'transparent',
                            '&:hover': {
                              backgroundColor: '#bbdefb'
                            }
                          }}
                        >
                          {expandedRows[product._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRows[product._id]} timeout="auto" unmountOnExit>
                          <Box sx={{
                            margin: 2,
                            backgroundColor: '#f3f6f9',
                            borderRadius: 2,
                            p: 2,
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                              sx={{
                                color: '#1565c0',
                                fontWeight: 'bold',
                                marginBottom: 2
                              }}
                            >
                              Product Variants
                            </Typography>
                            <Table
                              size="small"
                              sx={{
                                backgroundColor: 'white',
                                borderRadius: 1,
                                overflow: 'hidden',
                                boxShadow: 1
                              }}
                            >
                              <TableHead>
                                <TableRow sx={{
                                  backgroundColor: '#1976d2',
                                  '& th': {
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                  }
                                }}>
                                  <TableCell>Size</TableCell>
                                  <TableCell>Color</TableCell>
                                  <TableCell>Stock</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell align="center">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {product.variants && product.variants.map((variant) => (
                                  <TableRow
                                    key={variant._id}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        transform: 'scale(1.001)',
                                        transition: 'all 0.2s ease'
                                      }
                                    }}
                                  >
                                    <TableCell>{variant.size}</TableCell>
                                    <TableCell>{variant.color}</TableCell>
                                    <TableCell>{variant.stock}</TableCell>
                                    <TableCell>₹{variant.price}</TableCell>
                                    <TableCell align="center">
                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                          backgroundColor: "#ef5350",
                                          '&:hover': {
                                            backgroundColor: "#c62828",
                                            transform: 'translateY(-2px)'
                                          },
                                          transition: 'all 0.2s',
                                          minWidth: '80px',
                                          fontWeight: 'bold'
                                        }}
                                        onClick={() => handleDeleteVariant(variant._id)}
                                      >
                                        Delete
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar open={false} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success">Action successful</Alert>
      </Snackbar>

      {/* Update Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              label="Category"
            >
              {categories.filter(cat => cat.status === 'listed').map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Brand</InputLabel>
            <Select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              label="Brand"
            >
              {brands.filter(brand => brand.status === 'listed').map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            margin="normal"
            multiline
            rows={3}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={editMode ? handleEditProduct : handleSubmit}>
            {editMode ? 'Update Product' : 'Save Product'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Variant Modal */}
      <Modal show={showVariantModal} onHide={() => {
        setShowVariantModal(false);
        setImagePreview({ main: null, sub1: null, sub2: null, sub3: null });
      }} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Variant for {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Left side - Form fields */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Size"
                name="size"
                value={variantData.size}
                onChange={handleVariantChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={variantData.color}
                onChange={handleVariantChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={variantData.stock}
                onChange={handleVariantChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={variantData.price}
                onChange={handleVariantChange}
                required
                margin="normal"
              />
            </Box>

            {/* Right side - Image uploads */}
            <Box sx={{ flex: 1 }}>
              {/* Main Image Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Main Image</Typography>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {imagePreview.main ? (
                    <img
                      src={imagePreview.main}
                      alt="Main preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Typography color="textSecondary">Drop or click to upload main image</Typography>
                  )}
                  <input
                    type="file"
                    name="mainImage"
                    accept="image/*"
                    onChange={handleVariantChange}
                    required
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                </Box>
              </Box>

              {/* Sub Images Upload */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Sub Images</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3].map((num) => (
                  <Box
                    key={num}
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 1,
                      width: '100px',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {imagePreview[`sub${num}`] ? (
                      <img
                        src={imagePreview[`sub${num}`]}
                        alt={`Sub ${num} preview`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <Typography variant="caption" color="textSecondary">Image {num}</Typography>
                    )}
                    <input
                      type="file"
                      name={`subImage${num}`}
                      accept="image/*"
                      onChange={handleVariantChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowVariantModal(false);
            setImagePreview({ main: null, sub1: null, sub2: null, sub3: null });
          }}>
            Close
          </Button>
          <Button variant="primary" onClick={handleVariantSubmit}>
            Save Variant
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
        itemType={deleteType}
      />
    </Box>
  );
};

export default Products;

