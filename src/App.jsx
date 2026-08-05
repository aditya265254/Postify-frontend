import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { AppRouter } from './routes/AppRoutes';

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <RouterProvider router={AppRouter}/>
    </>
  )
}

export default App