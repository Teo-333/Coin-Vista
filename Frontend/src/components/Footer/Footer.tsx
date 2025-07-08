import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('header.product'),
      links: [
        { label: t('header.dashboard'), href: '/' },
      ],
    },
    {
      title: t('header.company'),
      links: [
        { label: t('header.about'), href: '/about' },
      ],
    },
    {
      title: t('header.legal'),
      links: [
        { label: t('header.privacyPolicy'), href: '/privacy' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
      }}
      className="mt-12 md:mt-16"
    >
      <Container maxWidth="xl" className="px-4 py-8 md:py-12">
        {/* Footer Content */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <Box className="sm:col-span-2 lg:col-span-1">
            <Typography
              variant="h6"
              component="div"
              className="font-bold text-lg md:text-xl mb-3 md:mb-4"
            >
              {t('header.appName')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="mb-4 max-w-xs"
            >
              Your trusted cryptocurrency tracking platform
            </Typography>
          </Box>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <Box key={section.title} className="space-y-2 md:space-y-3">
              <Typography
                variant="subtitle1"
                className="font-semibold text-sm uppercase tracking-wider"
                color="text.primary"
              >
                {section.title}
              </Typography>
              <Box className="space-y-1 md:space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    className="block text-sm transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider className="my-6 md:my-8" />

        {/* Copyright */}
        <Box className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
          <Typography variant="body2" color="text.secondary">
            © 2024 CoinVista. All rights reserved.
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