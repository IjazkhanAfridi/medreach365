import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SchoolSidebar from '../common/SchoolSidebar'
import DoctorSidebar from '../common/DoctorSidebar'
import { getAuth, signOut } from 'firebase/auth'

const DoctorLayout = ({ children, students }) => {
  const navigate = useNavigate()
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
        <DoctorSidebar students={students} />
      </div>
      <div className="flex-grow md:ml-[290px]">
        <div className="flex justify-end items-center bg-blue-100 w-full h-[70px]">
          <button onClick={handleLogout} className='bg-blue-800 px-6 mx-4 h-[40px] py-2 rounded-[22px] text-white font-semibold' >
            Log Out
          </button>
        </div>
        <div className="w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DoctorLayout