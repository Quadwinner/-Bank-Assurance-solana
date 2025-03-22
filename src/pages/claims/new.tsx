import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Alert, 
  AlertTitle, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
  Snackbar,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useApp } from '../../utils/context';
import { mockPolicies } from '../../utils/mockData';
import { PublicKey, Transaction } from '@solana/web3.js';
import { fileClaimInstruction } from '../../utils/programInstructions';

const steps = ['Select Policy', 'Claim Details', 'Review & Submit'];

const NewClaimPage = () => {
  const { isWalletConnected, userProfile, wallet, connection, connectWallet } = useApp();
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  
  // Form state
  const [claimForm, setClaimForm] = useState({
    policyId: '',
    amount: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    documents: [] as File[],
    agreeToTerms: false
  });
  
  // Validation state
  const [formErrors, setFormErrors] = useState({
    policyId: false,
    amount: false,
    description: false,
    agreeToTerms: false
  });
  
  // Filter policies that belong to the user
  const userPolicies = userProfile ? mockPolicies.filter(policy => 
    policy.holder === userProfile.id && policy.active
  ) : [];
  
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }
    
    if (activeStep === steps.length - 1) {
      handleSubmitClaim();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const validateCurrentStep = () => {
    const errors = {
      policyId: false,
      amount: false,
      description: false,
      agreeToTerms: false
    };
    
    let isValid = true;
    
    if (activeStep === 0) {
      if (!claimForm.policyId) {
        errors.policyId = true;
        isValid = false;
      }
    } else if (activeStep === 1) {
      if (!claimForm.amount || parseFloat(claimForm.amount) <= 0) {
        errors.amount = true;
        isValid = false;
      }
      
      if (!claimForm.description || claimForm.description.length < 10) {
        errors.description = true;
        isValid = false;
      }
    } else if (activeStep === 2) {
      if (!claimForm.agreeToTerms) {
        errors.agreeToTerms = true;
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    console.log(`Field changed: ${name}, type: ${type}, value type: ${typeof value}, checked type: ${typeof checked}`);
    
    // Special handling for checkbox
    if (type === 'checkbox' && name === 'agreeToTerms') {
      // Ensure we're using actual boolean values
      const boolValue = checked === true;
      console.log(`Checkbox value before conversion: ${checked}, type: ${typeof checked}`);
      console.log(`Checkbox value after conversion: ${boolValue}, type: ${typeof boolValue}`);
      
      setClaimForm(prev => ({
        ...prev,
        agreeToTerms: boolValue
      }));
      
      if (formErrors.agreeToTerms) {
        setFormErrors(prev => ({
          ...prev,
          agreeToTerms: false
        }));
      }
      return;
    }
    
    // Handle other form fields
    setClaimForm(prev => ({
      ...prev,
      [name as string]: value
    }));
    
    // Clear errors
    if (name && formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };
  
  const handleSubmitClaim = async () => {
    setLoading(true);
    
    try {
      if (!wallet || !wallet.publicKey || !connection || !isWalletConnected) {
        throw new Error('Wallet not connected');
      }
      
      // Get selected policy
      const policy = userPolicies.find(p => p.id === claimForm.policyId);
      if (!policy) {
        throw new Error('Selected policy not found');
      }
      
      // Create claim amount
      const claimAmount = parseFloat(claimForm.amount);
      if (isNaN(claimAmount) || claimAmount <= 0) {
        throw new Error('Invalid claim amount');
      }
      
      // Use a valid Solana address format for the program ID
      const programPublicKey = new PublicKey('11111111111111111111111111111111');
      
      // Create instruction for filing claim
      const instruction = await fileClaimInstruction(
        programPublicKey,
        wallet.publicKey,
        policy.id,
        claimAmount,
        claimForm.description
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
        console.log('Showing Phantom wallet for approval...');
        
        // Since we don't have an actual deployed program,
        // we'll just simulate the transaction success after wallet confirmation
        try {
          // Just ask for signing to show the popup, but we won't actually send it
          await wallet.signTransaction(transaction);
          
          // If the user approves in Phantom, we'll simulate success
          console.log('Transaction approved in wallet!');
          
          // Simulate blockchain delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setNotification({
            open: true,
            message: 'Claim filed successfully! Redirecting to claims page...',
            severity: 'success'
          });
          
          // Redirect to claims page after short delay
          setTimeout(() => {
            router.push('/claims');
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
    } catch (error) {
      console.error('Error filing claim:', error);
      setNotification({
        open: true,
        message: `Error filing claim: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  if (!isWalletConnected) {
    return (
      <Layout title="File a New Claim">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              File a New Claim
            </Typography>
            <Alert severity="warning">
              <AlertTitle>Wallet not connected</AlertTitle>
              Please connect your wallet to file an insurance claim
            </Alert>
            <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
              Connect Wallet
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (userPolicies.length === 0) {
    return (
      <Layout title="File a New Claim">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              File a New Claim
            </Typography>
            <Alert severity="info">
              <AlertTitle>No active policies found</AlertTitle>
              You need to have an active insurance policy to file a claim
            </Alert>
            <Button 
              variant="contained" 
              onClick={() => router.push('/products')}
              sx={{ mt: 2, mr: 2 }}
            >
              Browse Insurance Products
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => router.push('/policies')}
              sx={{ mt: 2 }}
            >
              View My Policies
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title="File a New Claim">
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/claims')}
            sx={{ mr: 2 }}
          >
            Back to Claims
          </Button>
          <Typography variant="h4">
            File a New Claim
          </Typography>
        </Box>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 4, mb: 4 }}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Policy
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please select the insurance policy for which you are filing a claim.
                </Alert>
                
                <FormControl 
                  fullWidth 
                  error={formErrors.policyId}
                  sx={{ mb: 3 }}
                >
                  <InputLabel id="policy-select-label">Insurance Policy</InputLabel>
                  <Select
                    labelId="policy-select-label"
                    id="policy-select"
                    name="policyId"
                    value={claimForm.policyId}
                    onChange={handleFormChange}
                    label="Insurance Policy"
                  >
                    {userPolicies.map(policy => (
                      <MenuItem key={policy.id} value={policy.id}>
                        {policy.productName} - Policy #{policy.id.substring(0, 8)}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.policyId && (
                    <FormHelperText>Please select a policy</FormHelperText>
                  )}
                </FormControl>
                
                {claimForm.policyId && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Selected Policy Details
                    </Typography>
                    
                    {(() => {
                      const policy = userPolicies.find(p => p.id === claimForm.policyId);
                      if (!policy) return null;
                      
                      return (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Product Name
                            </Typography>
                            <Typography variant="body1">
                              {policy.productName}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Coverage Amount
                            </Typography>
                            <Typography variant="body1">
                              ${policy.coverageAmount.toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Annual Premium
                            </Typography>
                            <Typography variant="body1">
                              ${policy.premium.toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Expiration Date
                            </Typography>
                            <Typography variant="body1">
                              {new Date(policy.endDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      );
                    })()}
                  </Box>
                )}
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Claim Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Claim Amount ($)"
                      name="amount"
                      value={claimForm.amount}
                      onChange={handleFormChange}
                      type="number"
                      error={formErrors.amount}
                      helperText={formErrors.amount ? "Please enter a valid amount" : ""}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Incident Date"
                      name="incidentDate"
                      type="date"
                      value={claimForm.incidentDate}
                      onChange={handleFormChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Claim Description"
                      name="description"
                      value={claimForm.description}
                      onChange={handleFormChange}
                      multiline
                      rows={4}
                      error={formErrors.description}
                      helperText={formErrors.description ? "Please provide a detailed description (minimum 10 characters)" : "Describe the incident, damage, or loss in detail"}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Supporting Documents (Optional)
                    </Typography>
                    <Button variant="outlined" component="label">
                      Upload Files
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                          if (e.target.files) {
                            setClaimForm(prev => ({
                              ...prev,
                              documents: Array.from(e.target.files || [])
                            }));
                          }
                        }}
                      />
                    </Button>
                    {claimForm.documents.length > 0 && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {claimForm.documents.length} file(s) selected
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review & Submit
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please review your claim details before submitting. Once submitted, your claim will be processed by our team.
                </Alert>
                
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Claim Summary
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Insurance Policy
                      </Typography>
                      <Typography variant="body1">
                        {(() => {
                          const policy = userPolicies.find(p => p.id === claimForm.policyId);
                          return policy ? `${policy.productName} - Policy #${policy.id.substring(0, 8)}` : 'Unknown';
                        })()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Claim Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ${parseFloat(claimForm.amount || '0').toLocaleString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Incident Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(claimForm.incidentDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Supporting Documents
                      </Typography>
                      <Typography variant="body1">
                        {claimForm.documents.length} file(s)
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Claim Description
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {claimForm.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
                  <Box sx={{ border: formErrors.agreeToTerms ? '1px solid #d32f2f' : '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={!!claimForm.agreeToTerms}
                          onChange={() => {
                            setClaimForm(prev => ({
                              ...prev,
                              agreeToTerms: !prev.agreeToTerms
                            }));
                            
                            if (formErrors.agreeToTerms) {
                              setFormErrors(prev => ({
                                ...prev, 
                                agreeToTerms: false
                              }));
                            }
                          }}
                          name="agreeToTerms"
                          color="primary"
                          id="agree-terms-checkbox"
                          size="medium"
                        />
                      }
                      label="I confirm that all information provided is true and accurate. I understand that providing false information may result in claim denial and policy termination."
                      sx={{ 
                        alignItems: 'flex-start',
                        '.MuiFormControlLabel-label': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </Box>
                  {formErrors.agreeToTerms && (
                    <FormHelperText error sx={{ ml: 2, mt: 0.5, fontSize: '0.875rem' }}>
                      You must confirm that the information provided is accurate to proceed
                    </FormHelperText>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (!claimForm.agreeToTerms) {
                          setFormErrors(prev => ({
                            ...prev,
                            agreeToTerms: true
                          }));
                          return;
                        }
                        handleSubmitClaim();
                      }}
                      disabled={loading}
                      sx={{ minWidth: 150 }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Processing...
                        </>
                      ) : (
                        'Submit Claim'
                      )}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          
          {activeStep !== steps.length - 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          )}
        </Paper>
        
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

export default NewClaimPage; 