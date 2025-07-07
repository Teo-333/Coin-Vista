import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

const supportedLanguages: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

export default function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguage = (lang: string) => () => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {supportedLanguages.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={i18n.language === code}
            onClick={handleLanguage(code)}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
