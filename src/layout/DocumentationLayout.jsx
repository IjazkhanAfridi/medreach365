import React, { useEffect } from 'react'
import Sidebar from '../common/Sidebar'
import TopBar from '../common/TopBar'
import { useNavigate } from 'react-router-dom'

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaUserCog, FaHome, FaAngleUp, FaBars, FaSearch, } from 'react-icons/fa';

const DocumentationLayout = ({ children ,sidebar, setModule}) => {

    const [openDropdown, setOpenDropdown] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [token])

    return (
        <div className='flex w-full'>
            <div className="fixed z-[10]">
                <div>
                    <button onClick={handleToggleSidebar} className="focus:outline-none md:hidden">
                        <FaBars className="text-lg" />
                    </button>
                    <div className={`${showSidebar ? 'block' : 'hidden'} md:block min-h-[100vh] bg-primary w-full md:w-[290px] text-white font-medium overflow-y-auto scrollbar`}>
                        <div className="flex justify-center py-8">
                            <Link to="/" className="flex items-center">Logo</Link>
                        </div>
                        <div className="mt-[100px]">
                            <div className={`w-[90%]  px-2 py-3 mx-auto`}>
                                <div className="flex w-full">
                                    <button className="focus:outline-none w-full">
                                            {sidebar && sidebar?.message?.map((links) => (
                                                <p key={links} onClick={(e) => setModule(links)} className="my-2 py-1 text-start text-xl font-semibold cursor-pointer">
                                                    {links}
                                                </p>
                                            ))}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-grow md:ml-[290px]">
                <div className="w-full z-10">
                    <TopBar />
                </div>
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DocumentationLayout