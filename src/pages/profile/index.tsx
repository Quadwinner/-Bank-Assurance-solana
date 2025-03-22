import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Container,
  Paper,
  Button,
  TextField,
  Avatar,
  Divider,
  Card,
  CardContent,
  Stack,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon, Wallet as WalletIcon } from '@mui/icons-material';
import Layout from '../../components/Layout';
import { useApp } from '../../utils/context';
import { mockPolicies, mockClaims } from '../../utils/mockData';

const ProfilePage = () => {
  const { isWalletConnected, wallet, userProfile, connectWallet, setUserProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile || {
    did: '',
    name: '',
    email: '',
    phone: '',
    riskProfile: 'medium',
    address: '',
    dateOfBirth: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Count user policies and claims
  const userPoliciesCount = isWalletConnected && userProfile 
    ? mockPolicies.filter(p => p.customer === userProfile.did).length 
    : 0;
    
  const userClaimsCount = isWalletConnected && userProfile 
    ? mockClaims.filter(c => c.customer === userProfile.did).length 
    : 0;

  const handleEditToggle = () => {
    if (isEditing) {
      // Save profile changes
      if (setUserProfile && editedProfile) {
        setUserProfile(editedProfile);
        setNotification({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success'
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setEditedProfile(prev => ({
      ...prev,
      riskProfile: e.target.value
    }));
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const getFormattedWalletAddress = () => {
    if (!wallet?.publicKey) return 'Not connected';
    const address = wallet.publicKey.toString();
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <Layout title="My Profile">
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and verify your identity
          </Typography>
        </Box>

        {!isWalletConnected ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Connect Your Wallet
              </Typography>
              <Typography variant="body1" paragraph>
                Please connect your wallet to access your profile
              </Typography>
            </Box>
            <Button variant="contained" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                  </Avatar>
                  <Typography variant="h6">
                    {userProfile?.name || 'Anonymous User'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <WalletIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {getFormattedWalletAddress()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Insurance Activity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Active Policies
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {userPoliciesCount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Claims Filed
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {userClaimsCount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Risk Profile
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {editedProfile?.riskProfile?.toUpperCase() || 'MEDIUM'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Blockchain Identity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Decentralized Identifier (DID)
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {userProfile?.did || wallet?.publicKey?.toString() || 'Not available'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Personal Information
                  </Typography>
                  <Button 
                    startIcon={isEditing ? undefined : <EditIcon />} 
                    onClick={handleEditToggle}
                    variant={isEditing ? "contained" : "outlined"}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={editedProfile?.name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={editedProfile?.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={editedProfile?.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={editedProfile?.dateOfBirth || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={editedProfile?.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel id="risk-profile-label">Risk Profile</InputLabel>
                      <Select
                        labelId="risk-profile-label"
                        id="risk-profile"
                        value={editedProfile?.riskProfile || 'medium'}
                        onChange={handleSelectChange}
                        label="Risk Profile"
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                {!isEditing && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Your profile information is securely stored and verified on the blockchain through your connected wallet.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
        
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

export default ProfilePage; 