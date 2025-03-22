import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Button,
  Paper,
  Divider,
  Container,
  Alert,
  AlertTitle,
  Stack
} from '@mui/material';
import Layout from '../components/Layout';
import { useApp } from '../utils/context';
import { useRouter } from 'next/router';
import { mockInsuranceProducts, mockPolicies, mockClaims } from '../utils/mockData';

const Dashboard = () => {
  const { isWalletConnected, userProfile, connectWallet } = useApp();
  const router = useRouter();
  
  // For demonstration, we'll use mock data
  const [activePolicies, setActivePolicies] = useState(0);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [totalPremiumPaid, setTotalPremiumPaid] = useState(0);
  
  useEffect(() => {
    if (isWalletConnected && userProfile) {
      // Count active policies
      const userPolicies = mockPolicies.filter(
        p => p.customer === userProfile.did && p.status === 'active'
      );
      setActivePolicies(userPolicies.length);
      
      // Calculate total premium paid
      const premium = userPolicies.reduce((sum, policy) => sum + policy.premium, 0);
      setTotalPremiumPaid(premium);
      
      // Count pending claims
      const userClaims = mockClaims.filter(
        c => c.customer === userProfile.did && c.status === 'pending'
      );
      setPendingClaims(userClaims.length);
    }
  }, [isWalletConnected, userProfile]);
  
  return (
    <Layout title="Dashboard">
      {!isWalletConnected ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            mb: 4
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to Bank-Assurance DAPP
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '700px', mb: 3 }}>
            A decentralized application for bank-assurance on the Solana blockchain. 
            Connect your wallet to access your insurance policies, view products, and manage claims.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={connectWallet}
            sx={{ minWidth: '200px' }}
          >
            Connect Wallet
          </Button>
        </Paper>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {userProfile?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Here's a summary of your insurance portfolio
          </Typography>
        </Box>
      )}
      
      {isWalletConnected && (
        <Grid container spacing={3}>
          {/* Summary Statistics */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Active Policies
                </Typography>
                <Typography variant="h3">
                  {activePolicies}
                </Typography>
                <Button 
                  sx={{ mt: 2 }} 
                  onClick={() => router.push('/policies')}
                >
                  View Policies
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Pending Claims
                </Typography>
                <Typography variant="h3">
                  {pendingClaims}
                </Typography>
                <Button 
                  sx={{ mt: 2 }} 
                  onClick={() => router.push('/claims')}
                >
                  View Claims
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Total Premium Paid
                </Typography>
                <Typography variant="h3">
                  ${totalPremiumPaid.toLocaleString()}
                </Typography>
                <Button 
                  sx={{ mt: 2 }} 
                  onClick={() => router.push('/profile')}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Featured Products */}
          <Grid item xs={12}>
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Featured Insurance Products
              </Typography>
              <Divider />
            </Box>
          </Grid>
          
          {mockInsuranceProducts.slice(0, 3).map((product) => (
            <Grid item key={product.id} xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="body1">
                    Premium: ${product.annualPremium.toLocaleString()}/year
                  </Typography>
                  <Typography variant="body1">
                    Coverage: ${product.coverageAmount.toLocaleString()}
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => router.push('/products')}
              >
                View All Products
              </Button>
            </Box>
          </Grid>
          
          {/* Blockchain Benefits */}
          <Grid item xs={12}>
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Benefits of Blockchain-based Insurance
              </Typography>
              <Divider />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Transparency
              </Typography>
              <Typography variant="body2">
                All policy terms, premium payments, and claims are recorded on the blockchain, 
                providing complete transparency and auditability.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Security
              </Typography>
              <Typography variant="body2">
                Your policy data is secured by Solana's advanced cryptography, 
                making it tamper-proof and ensuring your privacy.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Efficiency
              </Typography>
              <Typography variant="body2">
                Smart contracts automate policy issuance, premium payments, and claims processing,
                reducing costs and processing times.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {!isWalletConnected && (
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            About Bank-Assurance DAPP
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Alert severity="info">
                  <AlertTitle>Decentralized Exchange for Insurance</AlertTitle>
                  Browse and purchase insurance products from various providers on our decentralized marketplace.
                </Alert>
                
                <Alert severity="success">
                  <AlertTitle>Verifiable Identity</AlertTitle>
                  Secure onboarding with decentralized identity solutions and verifiable credentials for KYC compliance.
                </Alert>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Alert severity="warning">
                  <AlertTitle>Smart Contract Policies</AlertTitle>
                  Policy terms, premiums, and claims are managed by secure smart contracts on Solana.
                </Alert>
                
                <Alert severity="info">
                  <AlertTitle>Transparent Premiums</AlertTitle>
                  Track all premium payments and policy status in real-time on the blockchain.
                </Alert>
              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={connectWallet}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      )}
    </Layout>
  );
};

export default Dashboard; 