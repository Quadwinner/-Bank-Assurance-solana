import React from 'react';
import { useRouter } from 'next/router';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Button, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import Layout from '../../components/Layout';
import { mockInsuranceProducts } from '../../utils/mockData';
import { useApp } from '../../utils/context';
import { MockIdentityData } from '../../utils/identity';

// Product type colors
const typeColors = {
  life: '#4caf50',
  health: '#2196f3',
  auto: '#ff9800',
  property: '#9c27b0'
};

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isWalletConnected, connectWallet } = useApp();
  
  // Find the product by id
  const product = mockInsuranceProducts.find(p => p.id === id);
  
  // Find the provider
  const insurers = MockIdentityData.createMockInsurers();
  const provider = insurers.find(i => i.did === product?.provider);
  
  // If product not found
  if (!product) {
    return (
      <Layout title="Product Not Found">
        <Container>
          <Alert severity="error">
            Product not found. The product may have been removed or the URL is incorrect.
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  // Handle purchase
  const handlePurchase = () => {
    if (!isWalletConnected) {
      connectWallet();
    } else {
      router.push(`/products/${id}/purchase`);
    }
  };
  
  return (
    <Layout title={product.name}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/products')}
            sx={{ mb: 2 }}
          >
            Back to Products
          </Button>
          
          <Grid container spacing={4}>
            {/* Product Main Info */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" gutterBottom>
                    {product.name}
                  </Typography>
                  <Chip 
                    label={product.type.charAt(0).toUpperCase() + product.type.slice(1)} 
                    sx={{ 
                      bgcolor: (typeColors as any)[product.type] || '#757575',
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Annual Premium
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        ${product.annualPremium.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Coverage Amount
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        ${product.coverageAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {product.minAge && product.maxAge && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Age Eligibility
                        </Typography>
                        <Typography variant="body1">
                          {product.minAge} - {product.maxAge} years
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {product.riskProfile && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Risk Profile
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {product.riskProfile}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handlePurchase}
                    fullWidth
                  >
                    {isWalletConnected ? 'Purchase Now' : 'Connect Wallet to Purchase'}
                  </Button>
                </Box>
              </Paper>
              
              {/* Terms and Conditions */}
              <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Terms and Conditions
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {product.terms}
                </Typography>
              </Paper>
            </Grid>
            
            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Provider Info */}
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Provider
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {provider?.name || 'Unknown Provider'}
                  </Typography>
                  {provider && (
                    <>
                      <Typography variant="body2">
                        Email: {provider.email}
                      </Typography>
                      <Typography variant="body2">
                        Phone: {provider.phoneNumber}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Purchase Process */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Purchase Process
                </Typography>
                
                <Stepper orientation="vertical" sx={{ mt: 2 }} activeStep={-1}>
                  <Step>
                    <StepLabel>
                      <Typography variant="body2">
                        Connect your wallet
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <Typography variant="body2">
                        Submit KYC verification
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <Typography variant="body2">
                        Select coverage period
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <Typography variant="body2">
                        Make premium payment
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <Typography variant="body2">
                        Receive policy NFT
                      </Typography>
                    </StepLabel>
                  </Step>
                </Stepper>
              </Paper>
              
              {/* Benefits */}
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Benefits
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Transparent Policy Terms" 
                      secondary="All policy terms are stored on the blockchain for complete transparency"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Instant Claims Processing" 
                      secondary="Smart contracts automate claim verification and processing"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Secure Premium Payments" 
                      secondary="All payments are securely processed on the Solana blockchain"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Immutable Policy Records" 
                      secondary="Your policy records cannot be altered or deleted"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default ProductDetailPage; 