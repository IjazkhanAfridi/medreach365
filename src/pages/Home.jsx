import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import { FaFilePen } from "react-icons/fa6";
import Main from '../layout/Main'
import { ref, onValue, get, update } from 'firebase/database';
import { database } from '../firebase';
import { getAuth, signOut } from 'firebase/auth';

const Home = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState([]);
    const auth = getAuth();
    const isAuthenticated = !!auth.currentUser;

    const handleApproval = async (userId) => {
        try {
            const userRef = ref(database, `users/${userId}`);
            await update(userRef, {
                status: 'approved',
            });
        } catch (error) {
            console.error('Error updating status:', error.message);
        }
    };

    const handleRejection = async (userId) => {
        try {
            const userRef = ref(database, `users/${userId}`);
            await update(userRef, {
                status: 'rejected',
            });
        } catch (error) {
            console.error('Error updating status:', error.message);
        }
    };

    // useEffect(() => {
        const userRef = ref(database, 'users');
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id,
                    ...data
                }));
                setUserData(userArray)
            } else {
                console.log("some error");
            }
        }).catch(err => console.log("catch error", err))
    // }, [isAuthenticated]);

    const pendingRequests = userData?.filter(pending => pending?.status == "pending")
    const rejectedRequests = userData?.filter(rejected => rejected?.status == "rejected")
    const completedRequests = userData?.filter(completed => completed?.status == "approved")
    // console.log('pendingRequests: ', pendingRequests);
    return (
        <Main>
            <div className="px-4 w-full">
                <div className="w-full flex justify-between mt-12">
                    <div className="bg-[#f3f3f3] w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>All Requests</p>
                            <button><IoMdMore className='w-[24px] text-[24px]' /></button>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{userData?.length}</p>
                            <span className='flex items-center text-[14px] text-green-600 bg-green-600 bg-opacity-20 px-[4px] rounded'><FaArrowUpLong className='mr-1 w-[12px] h-[12px]' /> 20%</span>
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Pending Requests</p>
                            <button><IoMdMore className='w-[24px] text-[24px]' /></button>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{pendingRequests?.length}</p>
                            <span className='flex items-center text-[14px] text-green-600 bg-green-600 bg-opacity-20 px-[4px] rounded'><FaArrowUpLong className='mr-1 w-[12px] h-[12px]' /> 20%</span>
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80 text-primary'>Rejected Requests</p>
                            <button><IoMdMore className='w-[24px] text-[24px]' /></button>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold text-primary'>{rejectedRequests?.length}</p>
                            <span className='flex items-center text-[14px] text-primary bg-red-600 bg-opacity-20 px-[4px] rounded'><FaArrowDownLong className='mr-1 w-[12px] h-[12px]' /> 20%</span>
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Completed</p>
                            <button><IoMdMore className='w-[24px] text-[24px]' /></button>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{completedRequests?.length}</p>
                            <span className='flex items-center text-[14px] text-green-600 bg-green-600 bg-opacity-20 px-[4px] rounded'><FaArrowUpLong className='mr-1 w-[12px] h-[12px]' /> 20%</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="flex">
                        <div className="w-[170px] bg-primary text-[24px] font-semibold text-white flex items-center justify-center  rounded-t-lg p-4 mr-2">
                            <FaFilePen className='mr-2' />
                            Requests
                        </div>
                        <div className="w-full bg-primary bg-opacity-10 text-[24px] font-semibold flex items-center rounded-t-lg p-4">
                            <div className="w-[10%]">
                                All
                            </div>
                            <div className="w-[20%]">
                                Pending
                            </div>
                            <div className="w-[20%]">
                                Approved
                            </div>
                            <div className="w-[20%]">
                                Rejected
                            </div>
                            <div className="w-[20%]">
                                Completed
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">

                    {userData?.map((data) => (
                        <div className="rounded-lg my-2" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                            <div className="w-full text-[18px] font-semibold flex justify-around items-center p-2">
                                <div className="w-[14%]">{data?.date}</div>
                                <div className="w-[14%]">{data?.name}</div>
                                <div className="w-[14%]">{data?.email}</div>
                                {data?.status == "approved" ?
                                    <div className="w-[35%] flex items-center justify-center">
                                        <div className="w-[50%] mx-1 bg-green-500 text-white text-center cursor-pointer p-3 rounded-lg">Approved</div>
                                    </div>
                                    :data?.status == "rejected" ?
                                    <div className="w-[35%] flex items-center justify-center">
                                        <div className="w-[50%] mx-1 bg-red-500 text-white text-center cursor-pointer p-3 rounded-lg">Rejected</div>
                                    </div>
                                    :
                                    <>
                                        <div onClick={() => handleApproval(data?.id)} className="w-[14%] mx-1 bg-green-500 text-white text-center cursor-pointer p-3 rounded-lg">Approve</div>
                                        <div onClick={() => handleRejection(data?.id)} className="w-[14%] mx-1 bg-primary text-white text-center cursor-pointer p-3 rounded-lg">Decline</div>
                                    </>
                                }
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </Main>
    )
}

export default Home