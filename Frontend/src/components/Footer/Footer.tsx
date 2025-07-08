import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              fontWeight: 600, 
              color: 'text.primary',
              mb: 1
            }}
          >
            {t('header.appName')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            Your trusted cryptocurrency tracking platform
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

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