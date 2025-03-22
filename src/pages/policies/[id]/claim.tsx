import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container,
  Paper,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider,
  InputAdornment,
  Snackbar,
  Checkbox
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Upload as UploadIcon,
  Send as SendIcon
} from '@mui/icons-material';
import Layout from '../../../components/Layout';
import { useApp } from '../../../utils/context';
import { mockPolicies, mockInsuranceProducts } from '../../../utils/mockData';
import { useRouter } from 'next/router';

const steps = ['Policy Verification', 'Claim Details', 'Documentation', 'Review & Submit'];

const FileClaim = () => {
  const { isWalletConnected, userProfile, connectWallet } = useApp();
  const router = useRouter();
  const { id } = router.query;
  
  const [activeStep, setActiveStep] = useState(0);
  const [policy, setPolicy] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  
  // Claim form state
  const [claimForm, setClaimForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    incidentType: '',
    documents: [] as string[],
    agreeToTerms: false
  });
  
  useEffect(() => {
    if (id && isWalletConnected) {
      // Find the policy
      const foundPolicy = mockPolicies.find(p => p.id === id);
      if (foundPolicy) {
        setPolicy(foundPolicy);
        
        // Find the associated product
        const foundProduct = mockInsuranceProducts.find(p => p.id === foundPolicy.productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
      }
    }
  }, [id, isWalletConnected]);
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitClaim();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setClaimForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleIncidentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly set the value as a string to avoid type issues
    const newValue = e.target.value;
    console.log('Incident type changed:', newValue, typeof newValue);
    
    setClaimForm(prev => ({
      ...prev,
      incidentType: newValue
    }));
  };
  
  const handleFileUpload = () => {
    // Simulate file upload
    setLoading(true);
    
    // Mock delay to simulate upload
    setTimeout(() => {
      const newDocuments = [...claimForm.documents];
      
      if (product?.type === 'Health') {
        newDocuments.push('Medical Report.pdf');
      } else if (product?.type === 'Auto') {
        newDocuments.push('Accident Report.pdf');
      } else if (product?.type === 'Home') {
        newDocuments.push('Property Damage Assessment.pdf');
      } else {
        newDocuments.push('Supporting Document.pdf');
      }
      
      setClaimForm(prev => ({
        ...prev,
        documents: newDocuments
      }));
      
      setLoading(false);
      
      setNotification({
        open: true,
        message: 'Document uploaded successfully',
        severity: 'success'
      });
    }, 1500);
  };
  
  const handleSubmitClaim = () => {
    setLoading(true);
    
    // Mock delay to simulate blockchain transaction
    setTimeout(() => {
      setLoading(false);
      
      setNotification({
        open: true,
        message: 'Claim submitted successfully! Redirecting to claims page...',
        severity: 'success'
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/claims');
      }, 2000);
    }, 2000);
  };
  
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  const getIncidentTypeOptions = () => {
    if (!product) return [];
    
    switch (product.type) {
      case 'Health':
        return [
          'Hospital Treatment',
          'Surgical Procedure',
          'Outpatient Care',
          'Medication',
          'Preventive Care'
        ];
      case 'Auto':
        return [
          'Collision',
          'Theft',
          'Natural Disaster',
          'Vandalism',
          'Third-party Damage'
        ];
      case 'Home':
        return [
          'Fire Damage',
          'Water Damage',
          'Theft',
          'Natural Disaster',
          'Liability'
        ];
      case 'Life':
        return [
          'Terminal Illness',
          'Critical Illness',
          'Hospitalization',
          'Disability'
        ];
      default:
        return ['Other'];
    }
  };
  
  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return true; // Policy verification is automatic
      case 1:
        return claimForm.description.length > 10 && 
               claimForm.amount.length > 0 && 
               parseFloat(claimForm.amount) > 0 &&
               claimForm.incidentType.length > 0;
      case 2:
        return claimForm.documents.length > 0;
      case 3:
        return claimForm.agreeToTerms;
      default:
        return false;
    }
  };
  
  if (!isWalletConnected) {
    return (
      <Layout title="File a Claim">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              File a Claim
            </Typography>
            <Alert severity="warning">
              Please connect your wallet to file a claim
            </Alert>
            <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
              Connect Wallet
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!policy || !product) {
    return (
      <Layout title="File a Claim">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              File a Claim
            </Typography>
            <Alert severity="error">
              Policy not found or you don't have permission to access this policy
            </Alert>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/policies')}
              sx={{ mt: 2 }}
            >
              Back to Policies
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title="File a Claim">
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/policies')}
            sx={{ mr: 2 }}
          >
            Back to Policies
          </Button>
          <Typography variant="h4">
            File a Claim
          </Typography>
        </Box>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Policy Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Policy Number
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {policy.policyNumber || policy.id.substring(0, 8)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Product Name
                </Typography>
                <Typography variant="body1">
                  {product.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Provider
                </Typography>
                <Typography variant="body1">
                  {product.provider}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Coverage Amount
                </Typography>
                <Typography variant="body1">
                  ${product.coverageAmount.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && (
              <Box>
                <Alert severity="success" sx={{ mb: 3 }}>
                  <AlertTitle>Policy Verified</AlertTitle>
                  Your policy is active and eligible for claims
                </Alert>
                
                <Typography variant="subtitle1" gutterBottom>
                  Coverage Details
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {policy.coverageDetails && policy.coverageDetails.map((detail: string, index: number) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Typography variant="body2">
                        • {detail}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                
                <Alert severity="info">
                  Please ensure your claim falls within the coverage outlined in your policy. Review the terms and conditions before proceeding.
                </Alert>
              </Box>
            )}
            
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Claim Description"
                    value={claimForm.description}
                    onChange={handleFormChange}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Please describe the details of your claim..."
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="amount"
                    label="Claim Amount"
                    value={claimForm.amount}
                    onChange={handleFormChange}
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="date"
                    label="Date of Incident"
                    type="date"
                    value={claimForm.date}
                    onChange={handleFormChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">Type of Incident</FormLabel>
                    <RadioGroup 
                      name="incidentType" 
                      value={claimForm.incidentType} 
                      onChange={handleIncidentTypeChange}
                      row
                    >
                      {getIncidentTypeOptions().map((option) => (
                        <FormControlLabel 
                          key={option} 
                          value={option} 
                          control={
                            <Radio 
                              // Explicitly set checked as a boolean comparison
                              checked={claimForm.incidentType === option}
                            />
                          } 
                          label={option} 
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please upload supporting documents for your claim. This may include receipts, reports, photos, or other relevant documentation.
                </Alert>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={handleFileUpload}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    Upload Document
                  </Button>
                  
                  {loading && <CircularProgress size={24} sx={{ mb: 2 }} />}
                  
                  {claimForm.documents.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2, width: '100%', maxWidth: 500 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Uploaded Documents
                      </Typography>
                      {claimForm.documents.map((doc, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            p: 1,
                            borderBottom: index < claimForm.documents.length - 1 ? 1 : 0,
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="body2">
                            {index + 1}. {doc}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  )}
                </Box>
                
                <Alert severity="warning">
                  <AlertTitle>Important</AlertTitle>
                  All documents uploaded will be cryptographically signed and stored on the blockchain. False or fraudulent claims may result in policy termination.
                </Alert>
              </Box>
            )}
            
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Claim Details
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Policy Number
                      </Typography>
                      <Typography variant="body1">
                        {policy.policyNumber || policy.id.substring(0, 8)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Product
                      </Typography>
                      <Typography variant="body1">
                        {product.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Claim Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ${parseFloat(claimForm.amount).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Incident Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(claimForm.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Incident Type
                      </Typography>
                      <Typography variant="body1">
                        {claimForm.incidentType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Documents
                      </Typography>
                      <Typography variant="body1">
                        {claimForm.documents.length} document(s) uploaded
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {claimForm.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(claimForm.agreeToTerms)}
                      onChange={(e) => {
                        setClaimForm(prev => ({
                          ...prev,
                          agreeToTerms: Boolean(e.target.checked)
                        }));
                      }}
                      name="agreeToTerms"
                      color="primary"
                    />
                  }
                  label="I confirm that all information provided is true and accurate. I understand that providing false information may result in claim denial and policy termination."
                  sx={{ alignItems: 'flex-start' }}
                />
                
                <Alert severity="info" sx={{ mt: 3 }}>
                  <AlertTitle>Next Steps</AlertTitle>
                  <Typography variant="body2">
                    After submission, your claim will be:
                  </Typography>
                  <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
                    <li>Recorded on the blockchain with a unique identifier</li>
                    <li>Verified by smart contracts against your policy terms</li>
                    <li>Processed within 48-72 hours</li>
                    <li>Automated payment will be made to your wallet upon approval</li>
                  </ol>
                </Alert>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {loading && <CircularProgress size={24} sx={{ mr: 1 }} />}
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === steps.length - 1 ? <SendIcon /> : undefined}
                disabled={!isStepComplete() || loading}
              >
                {activeStep === steps.length - 1 ? 'Submit Claim' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      
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
    </Layout>
  );
};

export default FileClaim; 