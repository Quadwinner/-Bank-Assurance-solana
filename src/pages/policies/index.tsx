import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Container,
  Paper,
  Button,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import Layout from '../../components/Layout';
import PolicyCard from '../../components/PolicyCard';
import { useApp } from '../../utils/context';
import { mockPolicies, mockInsuranceProducts, Policy } from '../../utils/mockData';

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
      id={`policies-tabpanel-${index}`}
      aria-labelledby={`policies-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PoliciesPage = () => {
  const { isWalletConnected, userProfile, connectWallet } = useApp();
  const [tabValue, setTabValue] = useState(0);
  const [userPolicies, setUserPolicies] = useState<Policy[]>([]);
  
  useEffect(() => {
    if (isWalletConnected && userProfile) {
      // Filter policies for the current user
      const policies = mockPolicies.filter(policy => policy.customer === userProfile.did);
      setUserPolicies(policies);
    }
  }, [isWalletConnected, userProfile]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const getProductName = (productId: string) => {
    const product = mockInsuranceProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  const getProductType = (productId: string) => {
    const product = mockInsuranceProducts.find(p => p.id === productId);
    return product ? product.type : 'unknown';
  };
  
  // Filter policies by status based on active tab
  const activePolicies = userPolicies.filter(policy => policy.status === 'active');
  const expiredPolicies = userPolicies.filter(policy => policy.status === 'expired' || policy.status === 'claimed');
  
  return (
    <Layout title="My Policies">
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Insurance Policies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your insurance policies
          </Typography>
        </Box>
        
        {!isWalletConnected ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <AlertTitle>Connect Your Wallet</AlertTitle>
            <Typography variant="body1" paragraph>
              Please connect your wallet to view your policies
            </Typography>
            <Button variant="contained" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Paper>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 4 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth" 
                aria-label="policy tabs"
              >
                <Tab label={`Active Policies (${activePolicies.length})`} />
                <Tab label={`Expired Policies (${expiredPolicies.length})`} />
              </Tabs>
            </Paper>
            
            <TabPanel value={tabValue} index={0}>
              {activePolicies.length > 0 ? (
                <Grid container spacing={3}>
                  {activePolicies.map((policy) => (
                    <Grid item key={policy.id} xs={12} sm={6} md={4}>
                      <PolicyCard 
                        policy={policy} 
                        productName={getProductName(policy.productId)} 
                        productType={getProductType(policy.productId)} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    You don't have any active policies
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => window.location.href = '/products'}
                    sx={{ mt: 2 }}
                  >
                    Browse Insurance Products
                  </Button>
                </Paper>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {expiredPolicies.length > 0 ? (
                <Grid container spacing={3}>
                  {expiredPolicies.map((policy) => (
                    <Grid item key={policy.id} xs={12} sm={6} md={4}>
                      <PolicyCard 
                        policy={policy} 
                        productName={getProductName(policy.productId)} 
                        productType={getProductType(policy.productId)} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    You don't have any expired policies
                  </Typography>
                </Paper>
              )}
            </TabPanel>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Policy Management with Blockchain
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Automated Renewals
                    </Typography>
                    <Typography variant="body2">
                      Smart contracts automatically handle policy renewals, ensuring continuous coverage without manual intervention.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Transparent Terms
                    </Typography>
                    <Typography variant="body2">
                      All policy terms are stored on the blockchain, providing complete transparency and preventing unauthorized changes.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Immutable Records
                    </Typography>
                    <Typography variant="body2">
                      Your policy history and claim records are immutably stored on the blockchain, ensuring accurate and tamper-proof documentation.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default PoliciesPage; 