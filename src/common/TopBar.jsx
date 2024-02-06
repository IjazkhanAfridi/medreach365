import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { IoIosNotifications } from "react-icons/io";
import { FaCoins } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { PiSignOutBold } from "react-icons/pi";
import { FaUserCog } from "react-icons/fa";
import useApi from '../hooks/useApi';
import { useDataContext } from '../context/DataContext';



const TopBar = () => {
    const { data, loading, error, get } = useApi()
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const userId = localStorage.getItem("UserId")
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const orgnizationName = localStorage.getItem("organization_name")
    const { updateData, credits, contextName, contextEmail } = useDataContext();

    const handleSignOut = (e) => {
        e.stopPropagation()
        localStorage.clear()
        navigate("/login")
    }
    const handleProfileClick = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        get(`api/auth/getcredits/?Id=${userId}`, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        })
    }, [userId, token])
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch(`https://conversational.avatare.com/api/auth/getprofile/?Id=${userId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: `Bearer ${token}`,
                },
              });
        
              if (response.ok) {
                const data = await response.json();
                setProfileData(data);
              } else {
                console.log('Error:', response.status);
              }
            } catch (error) {
              console.log('Error:', error.message);
            }
          };
          fetchData()
    }, [])
    if (data) {
        updateData(data?.message);
    }

    return (
        <div className='contianer mx-auto'>
            <div className="w-full flex items-center justify-end ">
                <nav className="p-4 flex items-center">
                    <div className="mr-8 hidden md:flex">
                        <div className="border min-w-[325px] h-[46px] mr-[100px] border-solid border-gray flex items-center justify-between rounded-[26px] p-2 px-3 focus:outline-none w-full">
                            <input placeholder={"search"} className="focus:outline-none ps-2" />
                            <button
                                type="button"
                                className="focus:outline-none px-2"
                            >
                                <FaSearch className='text-[#888585] my-auto' />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center mx-1">
                        <FaCoins className="mr-2 text-primary w-[25px] h-[25px]" />
                        <span className='font-bold text-lg'> {credits?.toLocaleString()} </span> (credits)
                    </div>
                    |
                    <div className="relative">
                        <button onClick={() => setNotificationDropdown(!notificationDropdown)} className="flex items-center focus:outline-none" >
                            <div className="flex items-center">
                                <IoIosNotifications className='mx-1 w-[25px] h-[25px] text-primary' />
                            </div>
                        </button>
                        {notificationDropdown && (
                            <div className="absolute right-0 mt-2 bg-white rounded shadow-md p-2 min-w-[250px] ">
                                <div className="flex items-center">
                                    <div className="">
                                        <ul className=" mx-auto">
                                            <li className="my-2">
                                                <button className="flex items-center">
                                                    <div className="bg-primary rounded-full w-[25px] h-[25px] flex justify-center items-center mx-2">
                                                        <FaUser className='text-white p-0' />
                                                    </div>
                                                    super admin share bot
                                                </button>
                                            </li>
                                            <hr />
                                            <li className="my-2">
                                                <button className="flex items-center">
                                                    <div className="bg-primary rounded-full w-[25px] h-[25px] flex justify-center items-center mx-2">
                                                        <FaUser className='text-white p-0' />
                                                    </div>
                                                    super admin share bot
                                                </button>
                                            </li>
                                            <hr />
                                        </ul>
                                    </div>
                                </div>
                                <div className="fixed top-0 left-0 h-full w-full -z-[10]" onClick={() => setNotificationDropdown(false)} />
                            </div>
                        )}
                    </div>
                    |
                    <div className="relative">
                        <button onClick={handleProfileClick} className="flex items-center focus:outline-none" >
                            <div className="flex items-center">

                                {profileData?.message && profileData?.message[0]?.profileS3Link == null ? (
                                    <div className="bg-primary rounded-full w-[25px] h-[25px] flex justify-center items-center mx-2">
                                        <FaUser className='text-white p-0' />
                                    </div>
                                ) : (
                                    <div className="w-[25px] h-[25px] rounded-full mx-2">
                                        <img alt='img' src={profileData?.message[0]?.profileS3Link} className='w-full h-[100%] rounded-full object-cover' style={{ maxWidth: '100%', maxHeight: '100px' }} />
                                    </div>
                                )}
                                <span className='font-bold text-lg'>{`${profileData?.message &&( profileData?.message[0]?.first_name == null || profileData?.message[0]?.first_name == "null"  ? profileData?.message[0]?.organization_name : (profileData?.message[0]?.first_name +" "+ profileData?.message[0]?.last_name))}`}</span>
                                {isDropdownOpen ? <FaAngleUp className="opacity-60 mx-2" /> : <FaAngleDown className="opacity-60 mx-2" />}
                            </div>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 min-w-[150px] mt-2 bg-white rounded shadow-md p-2">
                                <div className="flex items-center">
                                    <div className="">
                                        <div className="text-center flex flex-col justify-center items-center">
                                            <div className="w-8 h-8 overflow-hidden ">
                                                <FaUser className='mx-auto' />
                                            </div>
                                            <div>
                                                <p className="font-bold">Name</p>
                                                <p className="text-gray-600">{contextEmail}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <ul className="w-[90%] mx-auto">
                                            <li className="my-2">
                                                <Link to="/profile" className="flex items-center">
                                                    <FaUserCog className="mr-2" />
                                                    My Account
                                                </Link>
                                            </li>
                                            <li className="my-2">
                                                <button onClick={handleSignOut} className="flex items-center">
                                                    <PiSignOutBold className="mr-2" />
                                                    Sign Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="fixed top-0 left-0 h-full w-full -z-[10]" onClick={() => setDropdownOpen(false)} />
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default TopBar