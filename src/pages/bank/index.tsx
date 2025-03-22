import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Shield as ShieldIcon,
  LocalAtm as MoneyIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { useApp } from '../../utils/context';
import { useRouter } from 'next/router';

const BankPage = () => {
  const { isWalletConnected, connectWallet } = useApp();
  const router = useRouter();

  // Mock bank data
  const bankInfo = {
    name: 'Global Trust Bank',
    description: 'A trusted partner in your financial journey, offering secure and innovative banking services.',
    partneredSince: '2021',
    insurancePartners: ['SafeGuard Insurance', 'MediCare Plus', 'HomeShield Security', 'DriveSafe Insurance'],
    products: [
      { id: '1', name: 'Life Insurance', count: 3 },
      { id: '2', name: 'Health Insurance', count: 5 },
      { id: '3', name: 'Home Insurance', count: 2 },
      { id: '4', name: 'Auto Insurance', count: 4 },
    ],
    benefits: [
      'Exclusive discounts on premium rates',
      'Expedited claim processing',
      'Integrated banking & insurance dashboard',
      'Dedicated relationship manager',
      'Annual insurance portfolio review',
    ],
  };

  if (!isWalletConnected) {
    return (
      <Layout title="Bank Partner">
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              Bank Partner Portal
            </Typography>
            <Alert severity="warning">
              <AlertTitle>Wallet not connected</AlertTitle>
              Please connect your wallet to access the bank partner portal
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
    <Layout title="Bank Partner">
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {bankInfo.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {bankInfo.description}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Partnered since: <Box component="span" sx={{ fontWeight: 'bold' }}>{bankInfo.partneredSince}</Box>
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => router.push('/products')}
                sx={{ mt: 2, mr: 2 }}
              >
                Browse Products
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => router.push('/policies')}
                sx={{ mt: 2 }}
              >
                View Your Policies
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image="/bank-building.jpg"
                  alt="Bank Building"
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    // If image fails to load, set a background color instead
                    const target = e.target as HTMLImageElement;
                    target.style.height = '180px';
                    target.style.backgroundColor = '#1976d2';
                    target.style.display = 'flex';
                    target.style.alignItems = 'center';
                    target.style.justifyContent = 'center';
                    target.alt = 'Global Trust Bank';
                  }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BankIcon fontSize="large" color="primary" />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Bank & Insurance Partners
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    We've partnered with the following leading insurance providers to offer you comprehensive coverage solutions:
                  </Typography>
                  <List dense>
                    {bankInfo.insurancePartners.map((partner, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={partner} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Available Insurance Products
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {bankInfo.products.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <DocumentIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.count} plans available
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 2 }}
                      onClick={() => router.push('/products')}
                    >
                      View Plans
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 6 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Benefits of Bank-Assurance
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <List>
                  {bankInfo.benefits.map((benefit, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Why Choose Us?
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body1" gutterBottom fontWeight="bold">
                        Enhanced Security
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blockchain-secured transactions and policies
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body1" gutterBottom fontWeight="bold">
                        Fast Processing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quick policy issuance and claim settlements
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <ShieldIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body1" gutterBottom fontWeight="bold">
                        Complete Protection
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comprehensive coverage for all your needs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <MoneyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body1" gutterBottom fontWeight="bold">
                        Cost Effective
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Special discounts for banking customers
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h5" gutterBottom>
              Recent Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell><Typography variant="subtitle2">Metric</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">Last Month</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">This Month</Typography></TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">Growth</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Policies Issued</TableCell>
                    <TableCell align="right">238</TableCell>
                    <TableCell align="right">284</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+19.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Claims Processed</TableCell>
                    <TableCell align="right">43</TableCell>
                    <TableCell align="right">52</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+20.9%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Claim Amount</TableCell>
                    <TableCell align="right">$4,258</TableCell>
                    <TableCell align="right">$4,312</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+1.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Customer Satisfaction</TableCell>
                    <TableCell align="right">4.2/5</TableCell>
                    <TableCell align="right">4.5/5</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+7.1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Alert severity="info" sx={{ mt: 4 }}>
            <AlertTitle>Exclusive Bank Customer Offer</AlertTitle>
            As a valued customer of Global Trust Bank, you're eligible for a 15% discount on all new insurance policies purchased through our platform. Use promo code <strong>GTBANK15</strong> at checkout.
          </Alert>
        </Box>
      </Container>
    </Layout>
  );
};

export default BankPage; 