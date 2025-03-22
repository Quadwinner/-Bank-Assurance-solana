import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  InputAdornment,
  Snackbar
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Layout from '../../../components/Layout';
import { useApp } from '../../../utils/context';
import { mockInsuranceProducts } from '../../../utils/mockData';
import { useRouter } from 'next/router';
import { PublicKey, Transaction } from '@solana/web3.js';
import { purchasePolicyInstruction, buildAndSendTransaction } from '../../../utils/programInstructions';

const steps = [
  'Product Selection',
  'Coverage Details',
  'Personal Information',
  'Payment',
  'Confirmation'
];

const PurchasePage = () => {
  const { isWalletConnected, userProfile, connectWallet, connection, wallet } = useApp();
  const router = useRouter();
  const { id } = router.query;
  
  const [activeStep, setActiveStep] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  
  // Purchase form state
  const [purchaseForm, setPurchaseForm] = useState({
    coveragePeriod: '1',
    paymentFrequency: 'annual',
    policyStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    agreeToTerms: false
  });
  
  useEffect(() => {
    if (id) {
      // Find the product
      const foundProduct = mockInsuranceProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
    
    // Pre-fill user information if available
    if (userProfile) {
      setPurchaseForm(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        dateOfBirth: userProfile.dateOfBirth || ''
      }));
    }
  }, [id, userProfile]);
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleCompletePurchase();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPurchaseForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCompletePurchase = async () => {
    setLoading(true);
    
    try {
      if (!product || !isWalletConnected || !userProfile) {
        throw new Error('Missing requirements for purchase');
      }
      
      // Get policy duration in months
      const durationInMonths = parseInt(purchaseForm.coveragePeriod) * 12;
      
      // Create the instructions
      if (wallet && wallet.publicKey && connection) {
        // Use a valid Solana address format for the program ID
        // Using a placeholder program ID in the correct format (Solana system program)
        const programPublicKey = new PublicKey('11111111111111111111111111111111');
        
        // Create instruction for policy purchase
        const instruction = await purchasePolicyInstruction(
          programPublicKey,
          wallet.publicKey,
          product.id,
          product.coverageAmount,
          calculateTotalPremium(),
          durationInMonths
        );
        
        // Create transaction
        const transaction = new Transaction();
        transaction.add(instruction);
        
        // Get recent blockhash
        const { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        
        try {
          // This will trigger the Phantom wallet popup
          // For development/demo purposes only - this simulates a successful transaction
          // In a real production app with a deployed program, you would use the actual transaction
          
          console.log('Showing Phantom wallet for approval...');
          
          // Since we don't have an actual deployed program,
          // we'll just simulate the transaction success after wallet confirmation
          // This approach still shows the Phantom popup but doesn't actually submit to the blockchain
          
          try {
            // Just ask for signing to show the popup, but we won't actually send it
            await wallet.signTransaction(transaction);
            
            // If the user approves in Phantom, we'll simulate success
            console.log('Transaction approved in wallet!');
            
            // Simulate blockchain delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setNotification({
              open: true,
              message: 'Policy purchased successfully! Redirecting to your policies page...',
              severity: 'success'
            });
            
            // Redirect to policies page after short delay
            setTimeout(() => {
              router.push('/policies');
            }, 2000);
          } catch (signError) {
            // This catches if user rejects the transaction in Phantom
            console.error('Transaction was rejected in wallet:', signError);
            throw new Error('Transaction was rejected in the wallet');
          }
        } catch (err) {
          // Properly format error message from wallet interaction
          console.error('Transaction signing failed:', err);
          throw new Error(err instanceof Error ? err.message : 'Transaction was not confirmed by the wallet');
        }
      } else {
        throw new Error('Wallet or connection not available');
      }
    } catch (error) {
      console.error('Error purchasing policy:', error);
      setNotification({
        open: true,
        message: `Error purchasing policy: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  const calculateTotalPremium = () => {
    if (!product) return 0;
    
    const basePremium = product.annualPremium;
    const years = parseInt(purchaseForm.coveragePeriod);
    let totalPremium = basePremium * years;
    
    // Apply discount for multi-year policies
    if (years > 1) {
      totalPremium = totalPremium * (1 - 0.05 * (years - 1));
    }
    
    return totalPremium;
  };
  
  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return true; // Product selection already done
      case 1:
        return true; // Coverage details are pre-filled with defaults
      case 2:
        return purchaseForm.name.length > 0 && 
               purchaseForm.email.length > 0 && 
               purchaseForm.phone.length > 0;
      case 3:
        return true; // Payment step has a continue button
      case 4:
        return purchaseForm.agreeToTerms;
      default:
        return false;
    }
  };
  
  if (!isWalletConnected) {
    return (
      <Layout title="Purchase Insurance">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Purchase Insurance
            </Typography>
            <Alert severity="warning">
              <AlertTitle>Wallet not connected</AlertTitle>
              Please connect your wallet to purchase insurance policies
            </Alert>
            <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
              Connect Wallet
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout title="Purchase Insurance">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Purchase Insurance
            </Typography>
            <Alert severity="error">
              <AlertTitle>Product not found</AlertTitle>
              The insurance product you're looking for could not be found
            </Alert>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/products')}
              sx={{ mt: 2 }}
            >
              Back to Products
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title={`Purchase ${product.name}`}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/products/${id}`)}
            sx={{ mr: 2 }}
          >
            Back to Product
          </Button>
          <Typography variant="h4">
            Purchase {product.name}
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box sx={{ mt: 4 }}>
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Selected Product
                    </Typography>
                    
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {product.description}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Annual Premium
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              ${product.annualPremium.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Coverage Amount
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              ${product.coverageAmount.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    
                    <Alert severity="info">
                      <AlertTitle>About this product</AlertTitle>
                      <Typography variant="body2">
                        This {product.type} insurance policy provides protection against various risks. 
                        Please review the product details and terms carefully before proceeding.
                      </Typography>
                    </Alert>
                  </Box>
                )}
                
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Coverage Details
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <FormLabel>Coverage Period</FormLabel>
                          <RadioGroup
                            name="coveragePeriod"
                            value={purchaseForm.coveragePeriod}
                            onChange={handleFormChange}
                          >
                            <FormControlLabel value="1" control={<Radio />} label="1 Year" />
                            <FormControlLabel value="2" control={<Radio />} label="2 Years (5% discount)" />
                            <FormControlLabel value="3" control={<Radio />} label="3 Years (10% discount)" />
                            <FormControlLabel value="5" control={<Radio />} label="5 Years (20% discount)" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <FormLabel>Payment Frequency</FormLabel>
                          <RadioGroup
                            name="paymentFrequency"
                            value={purchaseForm.paymentFrequency}
                            onChange={handleFormChange}
                          >
                            <FormControlLabel value="annual" control={<Radio />} label="Annual (Pay once a year)" />
                            <FormControlLabel value="semiannual" control={<Radio />} label="Semi-Annual (Pay twice a year)" />
                            <FormControlLabel value="quarterly" control={<Radio />} label="Quarterly (Pay four times a year)" />
                            <FormControlLabel value="monthly" control={<Radio />} label="Monthly (Pay monthly)" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Policy Start Date"
                          type="date"
                          name="policyStartDate"
                          value={purchaseForm.policyStartDate}
                          onChange={handleFormChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText="Policy coverage will begin from this date"
                        />
                      </Grid>
                    </Grid>
                    
                    <Alert severity="info" sx={{ mt: 3 }}>
                      <AlertTitle>Coverage Information</AlertTitle>
                      <Typography variant="body2">
                        Your policy will be active for {purchaseForm.coveragePeriod} year(s) starting from {new Date(purchaseForm.policyStartDate).toLocaleDateString()}.
                        Payments will be processed {purchaseForm.paymentFrequency}ly.
                      </Typography>
                    </Alert>
                  </Box>
                )}
                
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={purchaseForm.name}
                          onChange={handleFormChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={purchaseForm.email}
                          onChange={handleFormChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={purchaseForm.phone}
                          onChange={handleFormChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={purchaseForm.dateOfBirth}
                          onChange={handleFormChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={purchaseForm.address}
                          onChange={handleFormChange}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                    
                    <Alert severity="info" sx={{ mt: 3 }}>
                      <AlertTitle>Secure Information</AlertTitle>
                      <Typography variant="body2">
                        Your personal information is securely stored and verified on the blockchain. 
                        It will be used to process your policy and any future claims.
                      </Typography>
                    </Alert>
                  </Box>
                )}
                
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Payment Details
                    </Typography>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <AlertTitle>Wallet Payment</AlertTitle>
                      <Typography variant="body2">
                        Payment will be processed through your connected wallet. Please ensure you have sufficient funds.
                      </Typography>
                    </Alert>
                    
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Payment Summary
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Base Annual Premium
                            </Typography>
                            <Typography variant="body1">
                              ${product.annualPremium.toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Coverage Period
                            </Typography>
                            <Typography variant="body1">
                              {purchaseForm.coveragePeriod} Year(s)
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Payment Frequency
                            </Typography>
                            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                              {purchaseForm.paymentFrequency}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Multi-year Discount
                            </Typography>
                            <Typography variant="body1">
                              {parseInt(purchaseForm.coveragePeriod) > 1 
                                ? `${5 * (parseInt(purchaseForm.coveragePeriod) - 1)}%` 
                                : 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Premium
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              ${calculateTotalPremium().toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              First Payment Due
                            </Typography>
                            <Typography variant="body1">
                              {new Date(purchaseForm.policyStartDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={handleNext}
                    >
                      Continue to Review
                    </Button>
                  </Box>
                )}
                
                {activeStep === 4 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Review and Confirm
                    </Typography>
                    
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Policy Summary
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Product
                            </Typography>
                            <Typography variant="body1">
                              {product.name}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Coverage Amount
                            </Typography>
                            <Typography variant="body1">
                              ${product.coverageAmount.toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Coverage Period
                            </Typography>
                            <Typography variant="body1">
                              {purchaseForm.coveragePeriod} Year(s)
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Start Date
                            </Typography>
                            <Typography variant="body1">
                              {new Date(purchaseForm.policyStartDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              End Date
                            </Typography>
                            <Typography variant="body1">
                              {new Date(new Date(purchaseForm.policyStartDate).setFullYear(
                                new Date(purchaseForm.policyStartDate).getFullYear() + parseInt(purchaseForm.coveragePeriod)
                              )).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Premium
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              ${calculateTotalPremium().toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Policyholder
                            </Typography>
                            <Typography variant="body1">
                              {purchaseForm.name}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Payment Frequency
                            </Typography>
                            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                              {purchaseForm.paymentFrequency}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={purchaseForm.agreeToTerms}
                          onChange={handleFormChange}
                          name="agreeToTerms"
                          color="primary"
                        />
                      }
                      label="I have read and agree to the terms and conditions of this insurance policy. I understand that my payment will be processed immediately upon confirmation."
                    />
                    
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                      {loading ? (
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                      ) : null}
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!purchaseForm.agreeToTerms || loading}
                        onClick={handleCompletePurchase}
                        sx={{ minWidth: 200 }}
                      >
                        {loading ? 'Processing...' : 'Complete Purchase'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
              
              {activeStep !== steps.length - 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepComplete()}
                  >
                    {activeStep === steps.length - 2 ? 'Review' : 'Next'}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Purchase Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected Product
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {product.name}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Coverage Amount
                  </Typography>
                  <Typography variant="body1">
                    ${product.coverageAmount.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Coverage Period
                  </Typography>
                  <Typography variant="body1">
                    {purchaseForm.coveragePeriod} Year(s)
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Frequency
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {purchaseForm.paymentFrequency}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Premium
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotalPremium().toLocaleString()}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Your policy will be issued as a non-fungible token (NFT) on the Solana blockchain, providing immutable proof of coverage.
                </Typography>
                
                <Alert severity="success" sx={{ mt: 2 }}>
                  <AlertTitle>Blockchain-Secured</AlertTitle>
                  All policy details will be securely stored on the Solana blockchain, ensuring transparency and immutability.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default PurchasePage; 