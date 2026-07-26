import axios from 'axios'
import  { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const AdminDashbord = () => {
    const [users, setUsers] = useState([])
    const [error, setError] = useState()
  const navigate = useNavigate();

useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || user?.role !== "admin") {
        navigate('/dashboard')
        return
    }
    
   
    (async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(
                `${backendUrl}/api/auth/admin/dashbord`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUsers(response.data.data)
        } catch (error) {
            setError(error.response?.data?.message || "something went wrong")
        }
    })()
}, [navigate])
      const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate('/')
  }
return (
    <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Admin Dashboard</h1>
        <button className='w-14 h-10 bg-red-500 rounded-4xl my-2.5 text-white cursor-pointer' onClick={handleLogout}>Logout</button>


        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
            <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                    <li key={user._id} className="py-2 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800">{user.fullName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">
                            {user.role}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
)
}

export default AdminDashbord