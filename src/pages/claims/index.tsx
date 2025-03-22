import React, { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Info as InfoIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useApp } from '../../utils/context';
import { mockClaims } from '../../utils/mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`claims-tabpanel-${index}`}
      aria-labelledby={`claims-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `claims-tab-${index}`,
    'aria-controls': `claims-tabpanel-${index}`,
  };
}

const ClaimsPage = () => {
  const { isWalletConnected, userProfile, connectWallet } = useApp();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Get mock claims for the current user
  const userClaims = userProfile ? mockClaims.filter(claim => 
    claim.userId === userProfile.id
  ) : [];

  // Filter claims by status
  const pendingClaims = userClaims.filter(claim => claim.status === 'pending');
  const approvedClaims = userClaims.filter(claim => claim.status === 'approved');
  const rejectedClaims = userClaims.filter(claim => claim.status === 'rejected');

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip 
          icon={<HourglassEmptyIcon />} 
          label="Pending" 
          color="warning" 
          variant="filled" 
          size="small" 
        />;
      case 'approved':
        return <Chip 
          icon={<CheckCircleIcon />} 
          label="Approved" 
          color="success" 
          variant="filled" 
          size="small" 
        />;
      case 'rejected':
        return <Chip 
          icon={<CancelIcon />} 
          label="Rejected" 
          color="error" 
          variant="filled" 
          size="small" 
        />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  if (!isWalletConnected) {
    return (
      <Layout title="Insurance Claims">
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Insurance Claims
            </Typography>
            <Alert severity="warning">
              <AlertTitle>Wallet not connected</AlertTitle>
              Please connect your wallet to view your insurance claims
            </Alert>
            <Button variant="contained" onClick={connectWallet} sx={{ mt: 2 }}>
              Connect Wallet
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Insurance Claims">
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Insurance Claims
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/claims/new')}
          >
            File New Claim
          </Button>
        </Box>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="claims tabs"
          >
            <Tab label={`All (${userClaims.length})`} {...a11yProps(0)} />
            <Tab label={`Pending (${pendingClaims.length})`} {...a11yProps(1)} />
            <Tab label={`Approved (${approvedClaims.length})`} {...a11yProps(2)} />
            <Tab label={`Rejected (${rejectedClaims.length})`} {...a11yProps(3)} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {userClaims.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Claims Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  You haven't filed any insurance claims yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/claims/new')}
                  sx={{ mt: 2 }}
                >
                  File New Claim
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {userClaims.map(claim => (
                  <Grid item xs={12} key={claim.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              Claim #{claim.id.substring(0, 8)}
                              <Tooltip title="View Claim Details">
                                <IconButton 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                  onClick={() => router.push(`/claims/${claim.id}`)}
                                >
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Filed on {new Date(claim.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                              {claim.description.substring(0, 100)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Policy: {claim.policyName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <Box>
                              {getStatusChip(claim.status)}
                              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                ${claim.amount.toLocaleString()}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => router.push(`/claims/${claim.id}`)}
                              sx={{ mt: 2 }}
                            >
                              View Details
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {pendingClaims.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No pending claims at the moment.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {pendingClaims.map(claim => (
                  <Grid item xs={12} key={claim.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              Claim #{claim.id.substring(0, 8)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Filed on {new Date(claim.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                              {claim.description.substring(0, 100)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Policy: {claim.policyName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <Box>
                              {getStatusChip(claim.status)}
                              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                ${claim.amount.toLocaleString()}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => router.push(`/claims/${claim.id}`)}
                              sx={{ mt: 2 }}
                            >
                              View Details
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {approvedClaims.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No approved claims yet.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {approvedClaims.map(claim => (
                  <Grid item xs={12} key={claim.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              Claim #{claim.id.substring(0, 8)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Filed on {new Date(claim.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                              {claim.description.substring(0, 100)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Policy: {claim.policyName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <Box>
                              {getStatusChip(claim.status)}
                              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                ${claim.amount.toLocaleString()}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => router.push(`/claims/${claim.id}`)}
                              sx={{ mt: 2 }}
                            >
                              View Details
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {rejectedClaims.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No rejected claims.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {rejectedClaims.map(claim => (
                  <Grid item xs={12} key={claim.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              Claim #{claim.id.substring(0, 8)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Filed on {new Date(claim.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                              {claim.description.substring(0, 100)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Policy: {claim.policyName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <Box>
                              {getStatusChip(claim.status)}
                              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                ${claim.amount.toLocaleString()}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => router.push(`/claims/${claim.id}`)}
                              sx={{ mt: 2 }}
                            >
                              View Details
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filing a Claim
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemText 
                primary="Select a Policy" 
                secondary="Choose the policy for which you want to file a claim" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Provide Claim Details" 
                secondary="Enter the claim amount, date of incident, and a detailed description" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Submit Supporting Documents" 
                secondary="Upload any relevant documents or evidence to support your claim" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Review and Submit" 
                secondary="Review your claim details and submit it for processing" 
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Claim Processing Time</AlertTitle>
            Most claims are processed within 48-72 hours. You'll receive notifications about your claim status.
          </Alert>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ClaimsPage; 