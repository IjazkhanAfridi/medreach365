import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { BiHomeAlt } from "react-icons/bi";
import { RiCustomerServiceLine } from "react-icons/ri";
import { FaSchool } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

const Sidebar = () => {
    const location = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div>
            <button onClick={handleToggleSidebar} className="focus:outline-none md:hidden">
                <FaBars className="text-lg" />
            </button>
            <div className={`${showSidebar ? 'block' : 'hidden'} md:block min-h-[100vh] bg-primary w-full md:w-[290px] text-white font-medium overflow-y-auto scrollbar`}>
                <div className="flex justify-start px-4 mt-12">
                    <Link to="/" className="flex items-start">
                        <div className="text-lg">
                            Logo
                        </div>
                    </Link>
                </div>
                <hr className='opacity-40 my-2' />
                <div className="">
                    <div className={`mx-auto`}>
                        <div className="flex items-center justify-between flex-col w-full">
                            <button className={`focus:outline-none flex justify-between items-center w-full py-3 border-l-4 ${location.pathname === "/" ? 'border-white' : 'border-transparent'}`}>
                                <Link to={"/"}>
                                    <div className="flex items-center ml-6 my-1">
                                        <BiHomeAlt className="mx-3 w-[30px] h-[30px]" />
                                        <p className='text-lg ml-2 font-[400]'>Home</p>
                                    </div>
                                </Link>
                            </button>
                            <button className={`focus:outline-none flex justify-between items-center w-full py-3 ${location.pathname === "/listedschool" ? 'border-l-4 border-white' : 'border-transparent'}`}>
                                <Link to={"/listedschool"}>
                                    <div className="flex items-center ml-6 my-1">
                                        <FaSchool className="mx-3 w-[30px] h-[30px]" />
                                        <p className='text-lg ml-2 font-[400]'>Schools</p>
                                    </div>
                                </Link>
                            </button>
                            <button className={`focus:outline-none flex justify-between items-center w-full py-3 ${location.pathname === "/listeddoctors" ? 'border-l-4 border-white' : 'border-transparent'}`}>
                                <Link to={"/listeddoctors"}>
                                    <div className="flex items-center ml-6 my-1">
                                        <FaUserDoctor className="mx-3 w-[30px] h-[30px]" />
                                        <p className='text-lg ml-2 font-[400]'>Doctors</p>
                                    </div>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
