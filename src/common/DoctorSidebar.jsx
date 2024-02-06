import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaUserCog, FaHome, FaAngleUp, FaBars, FaSearch, } from 'react-icons/fa';
import { useDataContext } from '../context/DataContext';


const DoctorSidebar = ({ students }) => {
    const {setStudentData } = useDataContext()
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(() => {
        if (students && students.length > 0) {
            setActiveIndex(0);
        }
    }, [students]);

    return (
        <div>
            <button onClick={handleToggleSidebar} className="focus:outline-none md:hidden">
                <FaBars className="text-lg" />
            </button>
            <div className={`${showSidebar ? 'block' : 'hidden'} md:block bg-primary w-full md:w-[290px] text-white font-medium h-[100vh] `}>
                <div className="flex justify-start px-4 pt-12">
                    <Link to="/" className="flex items-start">
                        <div className="text-lg">
                            Logo
                        </div>
                    </Link>
                </div>
                <hr className='opacity-40 my-2 ' />
                <div className="overflow-y-auto scrollbar h-[calc(100vh-100px)]">
                    <div className={`mx-auto `}>
                        <div className="flex items-center justify-between flex-col w-full mb-[150px]">
                            {students?.map((data,index) => (
                                <button onClick={() => {setStudentData(data); setActiveIndex(index)}} className={`focus:outline-none flex justify-between items-center w-full py-3 ${activeIndex === index ? 'border-l-4 border-white' : ''}`}>
                                    <div className="flex items-center ml-6 my-1">
                                        <p className='text-lg ml-2 font-[400]'>{data?.firstName +" "+ data?.lastName}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSidebar;
