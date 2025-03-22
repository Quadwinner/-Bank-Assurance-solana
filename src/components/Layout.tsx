import React, { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  Description, 
  LocalHospital, 
  AccountBalance, 
  Person,
  Receipt,
  Warning,
} from '@mui/icons-material';
import { useApp } from '../utils/context';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Bank-Assurance DAPP' }) => {
  const { 
    isWalletConnected, 
    connectWallet, 
    disconnectWallet, 
    userProfile, 
    isLoading, 
    error,
    isPhantomInstalled,
    wallet 
  } = useApp();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const router = useRouter();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Insurance Products', icon: <LocalHospital />, path: '/products' },
    { text: 'My Policies', icon: <Description />, path: '/policies' },
    { text: 'Claims', icon: <Receipt />, path: '/claims' },
    { text: 'Banks', icon: <AccountBalance />, path: '/banks' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const handleWalletClick = async () => {
    try {
      if (isWalletConnected) {
        await disconnectWallet();
      } else {
        if (!isPhantomInstalled) {
          window.open('https://phantom.app/', '_blank');
        } else {
          await connectWallet();
        }
      }
    } catch (error) {
      console.error('Error handling wallet click:', error);
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Bank-Assurance
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {userProfile ? userProfile.name : 'Not Connected'}
        </Typography>
        {isWalletConnected && wallet.publicKey && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {wallet.publicKey.toString().substring(0, 8)}...
              {wallet.publicKey.toString().substring(wallet.publicKey.toString().length - 8)}
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              router.push(item.path);
              toggleDrawer();
            }}
            selected={router.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          
          {!isPhantomInstalled && (
            <Tooltip title="Phantom wallet is not installed">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="body2" color="inherit">
                  Phantom not installed
                </Typography>
              </Box>
            </Tooltip>
          )}
          
          {isWalletConnected && wallet.publicKey && (
            <Chip 
              label={`${wallet.publicKey.toString().substring(0, 4)}...${wallet.publicKey.toString().substring(wallet.publicKey.toString().length - 4)}`}
              color="secondary" 
              size="small"
              sx={{ mr: 2 }}
            />
          )}
          
          <Button 
            color="inherit" 
            onClick={handleWalletClick}
            disabled={!isPhantomInstalled && isWalletConnected}
          >
            {isWalletConnected 
              ? 'Disconnect Wallet' 
              : isPhantomInstalled 
                ? 'Connect Phantom' 
                : 'Install Phantom'
            }
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {drawerContent}
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {!isPhantomInstalled && !isWalletConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Phantom wallet is not installed. <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">Install Phantom</a> to use all features.
          </Alert>
        )}
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </Container>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Bank-Assurance DAPP on Solana Blockchain
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 