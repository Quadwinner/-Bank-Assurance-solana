import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Container,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { mockInsuranceProducts } from '../../utils/mockData';
import { useApp } from '../../utils/context';

// Product type options
const productTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'life', label: 'Life Insurance' },
  { value: 'health', label: 'Health Insurance' },
  { value: 'auto', label: 'Auto Insurance' },
  { value: 'property', label: 'Property Insurance' }
];

// Sort options
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'premium-low', label: 'Premium: Low to High' },
  { value: 'premium-high', label: 'Premium: High to Low' },
  { value: 'coverage-low', label: 'Coverage: Low to High' },
  { value: 'coverage-high', label: 'Coverage: High to Low' }
];

const ProductsPage = () => {
  const { isWalletConnected } = useApp();
  
  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle product type filter change
  const handleTypeChange = (event: SelectChangeEvent) => {
    setProductType(event.target.value);
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };
  
  // Filter products based on search term and product type
  const filteredProducts = mockInsuranceProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = productType === 'all' || product.type === productType;
    
    return matchesSearch && matchesType;
  });
  
  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'premium-low':
        return a.premium - b.premium;
      case 'premium-high':
        return b.premium - a.premium;
      case 'coverage-low':
        return a.coverage - b.coverage;
      case 'coverage-high':
        return b.coverage - a.coverage;
      default:
        return 0;
    }
  });
  
  return (
    <Layout title="Insurance Products">
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Insurance Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse our range of insurance products offered by trusted insurers
          </Typography>
        </Box>
        
        {/* Filters and Search */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="product-type-label">Product Type</InputLabel>
                <Select
                  labelId="product-type-label"
                  id="product-type"
                  value={productType}
                  onChange={handleTypeChange}
                  label="Product Type"
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Product count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {sortedProducts.length} products found
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" color="text.secondary">
            Prices shown are yearly premiums
          </Typography>
        </Box>
        
        {/* Products Grid */}
        <Grid container spacing={3}>
          {sortedProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
          
          {sortedProducts.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No products match your search criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your filters or search term
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default ProductsPage; 