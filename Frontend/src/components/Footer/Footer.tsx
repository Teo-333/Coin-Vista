import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

const Footer: React.FC = () => {

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            © 2025 CoinVista. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cryptocurrency data provided by CoinGecko
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 