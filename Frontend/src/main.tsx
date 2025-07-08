import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider,} from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { Box } from '@mui/material'

import './i18n';

import Dashboard from './components/Dashboard/Dashboard.tsx'
import Header from './components/Header/Header.tsx'
import Footer from './components/Footer/Footer.tsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Dashboard/>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Header/>
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <RouterProvider router={router}/>
        </Box>
        <Footer/>
      </Box>
    </ThemeProvider>
  </StrictMode>,
)
