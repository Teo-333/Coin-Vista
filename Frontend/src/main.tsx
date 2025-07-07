import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider,} from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider.tsx'

import './i18n';   
import './index.css'

import App from './App.tsx'
import Header from './components/Header/Header.tsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Header/>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </StrictMode>,
)
