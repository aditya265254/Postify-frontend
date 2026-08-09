import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { AppRouter } from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <ToastContainer position="top-right" autoClose={1200} />
      <RouterProvider router={AppRouter}/>
    </ThemeProvider>
  )
}

export default App