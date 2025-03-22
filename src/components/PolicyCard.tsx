import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip,
  Box,
  Divider,
  LinearProgress
} from '@mui/material';
import { Policy } from '../utils/mockData';
import { useRouter } from 'next/router';

interface PolicyCardProps {
  policy: Policy;
  productName: string;
  productType: string;
}

// Status colors
const statusColors = {
  active: '#4caf50',
  expired: '#f44336',
  claimed: '#ff9800'
};

// Product type colors
const typeColors = {
  life: '#4caf50',
  health: '#2196f3',
  auto: '#ff9800',
  property: '#9c27b0'
};

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, productName, productType }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/policies/${policy.id}`);
  };

  const handleFileClaim = () => {
    router.push(`/policies/${policy.id}/claim`);
  };

  // Calculate policy progress (how much time has passed)
  const calculateProgress = () => {
    const total = policy.endDate - policy.startDate;
    const elapsed = Date.now() - policy.startDate;
    return Math.min(Math.max(Math.floor((elapsed / total) * 100), 0), 100);
  };

  const progress = calculateProgress();

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {productName}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip 
              label={policy.status.toUpperCase()} 
              size="small" 
              sx={{ 
                bgcolor: (statusColors as any)[policy.status] || '#757575',
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
            <Chip 
              label={productType.charAt(0).toUpperCase() + productType.slice(1)} 
              size="small" 
              sx={{ 
                bgcolor: (typeColors as any)[productType] || '#757575',
                color: 'white'
              }} 
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Policy ID:
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {policy.id}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Premium:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            ${policy.premium.toLocaleString()}/year
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Start Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(policy.startDate)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            End Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(policy.endDate)}
          </Typography>
        </Box>
        
        {policy.status === 'active' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Policy Progress:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }} 
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button size="small" onClick={handleViewDetails}>View Details</Button>
        {policy.status === 'active' && (
          <Button 
            size="small" 
            variant="contained" 
            color="primary"
            onClick={handleFileClaim}
            sx={{ ml: 'auto' }}
          >
            File Claim
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default PolicyCard; 