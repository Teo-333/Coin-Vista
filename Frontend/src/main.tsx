import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider,} from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { Box } from '@mui/material'

import './i18n';

import Dashboard from './components/Dashboard/Dashboard.tsx'
import SignIn from './components/Auth/SignIn.tsx'
import SignUp from './components/Auth/SignUp.tsx'
import Profile from './components/Profile/Profile.tsx'
import Header from './components/Header/Header.tsx'
import Footer from './components/Footer/Footer.tsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Dashboard/>
  },
  {
    path:"/signin",
    element:<SignIn/>
  },
  {
    path:"/signup",
    element:<SignUp/>
  },
  {
    path:"/profile",
    element:<Profile/>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
