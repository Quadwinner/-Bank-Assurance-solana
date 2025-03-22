import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Container,
  Paper,
  Button,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
  Description as DocumentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as MedicalIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Upload as UploadIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { useApp } from '../../utils/context';
import { mockClaims, mockPolicies, mockInsuranceProducts, Claim } from '../../utils/mockData';
import { useRouter } from 'next/router';

const ClaimDetailPage = () => {
  const { isWalletConnected, userProfile } = useApp();
  const router = useRouter();
  const { id } = router.query;
  const [claim, setClaim] = useState<Claim | null>(null);
  const [policy, setPolicies] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id && isWalletConnected) {
      const foundClaim = mockClaims.find(claim => claim.id === id);
      
      if (foundClaim) {
        setClaim(foundClaim);
        
        // Find related policy and product
        const relatedPolicy = mockPolicies.find(policy => policy.id === foundClaim.policyId);
        if (relatedPolicy) {
          setPolicies(relatedPolicy);
          
          const relatedProduct = mockInsuranceProducts.find(
            product => product.id === relatedPolicy.productId
          );
          if (relatedProduct) {
            setProduct(relatedProduct);
          }
        }
      }
      setLoading(false);
    }
  }, [id, isWalletConnected]);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <CancelIcon color="error" />;
      default:
        return <TimeIcon />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'approved':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      default:
        return '#757575';
    }
  };
  
  const getClaimSteps = () => {
    if (!claim) return [];
    
    const steps = [
      { label: 'Claim Submitted', completed: true, date: claim.submittedAt },
      { label: 'Under Review', completed: claim.status !== 'pending', date: claim.submittedAt + 86400000 },
      { label: claim.status === 'approved' ? 'Claim Approved' : 'Claim Rejected', 
        completed: claim.status === 'approved' || claim.status === 'rejected',
        date: claim.processedAt || Date.now() },
      { label: 'Payment Processed', 
        completed: claim.status === 'approved' && !!claim.processedAt,
        date: claim.processedAt ? claim.processedAt + 86400000 : null }
    ];
    
    return steps;
  };
  
  const getActiveStep = () => {
    if (!claim) return 0;
    
    switch (claim.status) {
      case 'pending':
        return 1;
      case 'approved':
        return claim.processedAt ? 3 : 2;
      case 'rejected':
        return 2;
      default:
        return 0;
    }
  };
  
  const getDocumentTypes = () => {
    if (!product) return [];
    
    // Generate required document types based on product type
    const baseDocuments = [
      { type: 'Claim Form', status: 'submitted', icon: <DocumentIcon /> },
      { type: 'Policy Document', status: 'verified', icon: <ReceiptIcon /> }
    ];
    
    // Add product-specific documents
    const additionalDocs = product.type === 'Health' 
      ? [{ type: 'Medical Records', status: 'submitted', icon: <DocumentIcon /> }]
      : product.type === 'Auto'
      ? [{ type: 'Accident Report', status: 'submitted', icon: <DocumentIcon /> }]
      : product.type === 'Home'
      ? [{ type: 'Property Assessment', status: 'submitted', icon: <DocumentIcon /> }]
      : [];
      
    return [...baseDocuments, ...additionalDocs];
  };
  
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Chip
            icon={<PendingIcon />}
            label="PENDING"
            color="warning"
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
        );
      case 'approved':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="APPROVED"
            color="success"
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<CancelIcon />}
            label="REJECTED"
            color="error"
            variant="filled"
            sx={{ fontWeight: 'bold' }}
          />
        );
      default:
        return <Chip label={status} />;
    }
  };
  
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'approved':
        return 2;
      case 'rejected':
        return 2;
      default:
        return 0;
    }
  };
  
  const getClaimTypeIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <MedicalIcon color="primary" />;
      case 'home':
        return <HomeIcon color="primary" />;
      case 'auto':
        return <CarIcon color="primary" />;
      case 'life':
        return <PersonIcon color="primary" />;
      default:
        return <DocumentIcon color="primary" />;
    }
  };
  
  const getDocumentIcon = (docType: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'pdf': <FileIcon style={{ color: '#F40F02' }} />,
      'doc': <FileIcon style={{ color: '#2A5699' }} />,
      'image': <FileIcon style={{ color: '#34A853' }} />,
      'default': <FileIcon style={{ color: '#757575' }} />
    };

    return iconMap[docType] || iconMap.default;
  };
  
  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };
  
  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };
  
  const handleUploadDocument = () => {
    // In a real app, this would handle the document upload
    // For now, just close the dialog
    setUploadDialogOpen(false);
  };
  
  if (loading) {
    return (
      <Layout title="Loading Claim Details">
        <Container>
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Loading Claim Details...
            </Typography>
            <LinearProgress />
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!claim || !policy || !product) {
    return (
      <Layout title="Claim Not Found">
        <Container>
          <Box sx={{ mt: 4 }}>
            <Alert severity="error">
              <AlertTitle>Claim Not Found</AlertTitle>
              We could not find the claim you are looking for. It may have been removed or the ID is incorrect.
            </Alert>
            <Button 
              variant="contained" 
              onClick={() => router.push('/claims')} 
              sx={{ mt: 2 }}
            >
              Return to Claims
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!isWalletConnected) {
    return (
      <Layout title="Wallet Not Connected">
        <Container>
          <Box sx={{ mt: 4 }}>
            <Alert severity="warning">
              <AlertTitle>Wallet Not Connected</AlertTitle>
              Please connect your wallet to view claim details.
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout title={`Claim #${claim.id.substring(0, 8)}`}>
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
            Claim #{claim.id.substring(0, 8)}
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Claim Status
                </Typography>
                <Box>
                  {getStatusChip(claim.status)}
                </Box>
              </Box>
              
              <Stepper activeStep={getActiveStep()} alternativeLabel sx={{ mb: 4 }}>
                {getClaimSteps().map((step, index) => (
                  <Step key={index} completed={step.completed}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Typography variant="subtitle1" gutterBottom>
                Claim Timeline
              </Typography>
              
              <Timeline position="alternate" sx={{ mb: 0, mt: 0 }}>
                {getClaimSteps().filter(step => step.date).map((step, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                      {step.date ? formatDate(step.date) : 'Pending'}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={step.completed ? "primary" : "grey"} />
                      {index < getClaimSteps().length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body1">
                        {step.label}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Claim Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Claim Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${claim.amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date Submitted
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(claim.submittedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Claim Type
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getClaimTypeIcon(claim.type)}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {claim.type.charAt(0).toUpperCase() + claim.type.slice(1)} Insurance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Policy Number
                  </Typography>
                  <Typography variant="body1">
                    {policy.id.substring(0, 8)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Claim Description
                  </Typography>
                  <Typography variant="body1">
                    {claim.description || "No description provided"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Supporting Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {getDocumentTypes().map((doc, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {doc.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={doc.type} 
                      secondary={`Status: ${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}`} 
                    />
                    <Chip 
                      label={doc.status.toUpperCase()} 
                      size="small"
                      color={doc.status === 'verified' ? 'success' : 'primary'}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Policy Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Policy Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {product.name}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Coverage Period
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
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
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Annual Premium
                  </Typography>
                  <Typography variant="body1">
                    ${product.annualPremium.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Provider Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Insurance Provider
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {product.provider}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Contact
                  </Typography>
                  <Typography variant="body1">
                    claims@{product.provider.toLowerCase().replace(/\s+/g, '')}.com
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            {claim.status === 'approved' && claim.processedAt && (
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BankIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Payment Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Amount Paid
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      ${claim.amount.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(claim.processedAt + 3600000)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      solana:{claim.id.substring(0, 32)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
            
            <Alert severity={
              claim.status === 'approved' ? 'success' : 
              claim.status === 'rejected' ? 'error' : 'info'
            }>
              {claim.status === 'approved' 
                ? 'Your claim has been approved. Payment has been processed automatically through the blockchain.' 
                : claim.status === 'rejected'
                ? 'Your claim has been rejected. Please contact customer support for more information.'
                : 'Your claim is being processed. You will be notified once a decision is made.'}
            </Alert>
          </Grid>
        </Grid>
      </Container>
      
      {/* Document Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose}>
        <DialogTitle>Upload Supporting Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a document to upload as evidence for your claim. Supported formats include PDF, DOC, JPG, and PNG.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ py: 2, border: '1px dashed' }}
            >
              Choose File
              <input
                type="file"
                hidden
              />
            </Button>
          </Box>
          <TextField
            margin="dense"
            id="document-description"
            label="Document Description"
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button onClick={handleUploadDocument} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ClaimDetailPage; 