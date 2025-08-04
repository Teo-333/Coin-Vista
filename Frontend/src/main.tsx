import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

import './i18n';

import Layout from './components/Layout/Layout.tsx'
import Dashboard from './components/Dashboard/Dashboard.tsx'
import SignIn from './components/Auth/SignIn.tsx'
import SignUp from './components/Auth/SignUp.tsx'
import Profile from './components/Profile/Profile.tsx'
import CoinDetails from './components/CoinDetails/CoinDetails.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      { 
        path: "signin",
        element: <SignIn />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "coins/:id",
        element: <CoinDetails />
      },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
