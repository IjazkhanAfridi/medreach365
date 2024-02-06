import React, { useEffect } from 'react'
import Sidebar from '../common/Sidebar'
import TopBar from '../common/TopBar'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'

const Main = ({ children }) => {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  // useEffect(() => {
  //     if (!token) {
  //         navigate("/login")
  //     }
  // }, [token])
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear()
      navigate("/login")
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className='flex w-full'>
      <div className="fixed z-[10]">
        <Sidebar />
      </div>
      <div className="flex-grow md:ml-[290px]">
      <div className="flex justify-end items-center bg-blue-100 w-full h-[70px]">
          <button onClick={handleLogout} className='bg-blue-800 px-6 mx-4 h-[40px] py-2 rounded-[22px] text-white font-semibold' >
            Log Out
          </button>
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Main