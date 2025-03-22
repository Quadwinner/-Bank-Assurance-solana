import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip,
  Box,
  Divider
} from '@mui/material';
import { InsuranceProduct } from '../utils/mockData';
import { useRouter } from 'next/router';

interface ProductCardProps {
  product: InsuranceProduct;
}

// Map product types to colors
const typeColors = {
  life: '#4caf50',
  health: '#2196f3',
  auto: '#ff9800',
  property: '#9c27b0'
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div" gutterBottom>
            {product.name}
          </Typography>
          <Chip 
            label={product.type.charAt(0).toUpperCase() + product.type.slice(1)} 
            size="small" 
            sx={{ 
              bgcolor: (typeColors as any)[product.type] || '#757575',
              color: 'white'
            }} 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Premium:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ${product.annualPremium.toLocaleString()}/year
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Coverage:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ${product.coverageAmount.toLocaleString()}
          </Typography>
        </Box>
        
        {product.minAge && product.maxAge && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Age Range:
            </Typography>
            <Typography variant="body1">
              {product.minAge} - {product.maxAge} years
            </Typography>
          </Box>
        )}
        
        {product.riskProfile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Risk Profile:
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {product.riskProfile}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button size="small" onClick={handleViewDetails}>View Details</Button>
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          onClick={() => router.push(`/products/${product.id}/purchase`)}
          sx={{ ml: 'auto' }}
        >
          Purchase
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 