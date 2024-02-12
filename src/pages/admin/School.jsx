import React, { useEffect, useState } from 'react'
import Main from '../../layout/Main'
import { getAuth } from 'firebase/auth'
import { get, onValue, ref, update } from 'firebase/database'
import { database } from "../../firebase"

const School = () => {
    const [userData, setUserData] = useState([]);
    const schools = userData && userData?.filter(data => data?.category == "school")
    console.log('schools: ', schools);
    const [selectedSchool, setSelectedSchool] = useState(null);
    console.log('selectedSchool: ', selectedSchool);
    const [assignedDoctor, setAssignedDoctor] = useState(null);
    const [render, setRender] = useState(false);
    const [render1, setRender1] = useState(false);
    const pendingSchools = schools?.filter(data => data?.status == "pending")
    const approvedSchools = schools?.filter(data => data?.status == "approved")
    const auth = getAuth();
    const isAuthenticated = !!auth.currentUser;

    useEffect(() => {
        const userRef = ref(database, 'users');
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id,
                    ...data
                }));
                setUserData(userArray)
                if (userArray) {
                    setRender(!render)
                }
            } else {
                console.log("some error");
            }
        }).catch(err => console.log("catch error", err))
    }, [isAuthenticated,render1]);

    useEffect(() => {
        const schoolsRef = ref(database, `schools/${selectedSchool ? selectedSchool?.id : schools[0]?.id}/doctors`);
        const unsubscribeSchools = onValue(schoolsRef, (snapshot) => {
            if (snapshot.exists()) {
                const schoolArray = Object.values(snapshot.val())
                setAssignedDoctor(schoolArray);
            }
        });

        return () => {
            unsubscribeSchools();
        };
    }, [isAuthenticated, selectedSchool, render,render1]);

    // const handleActivate = async (userId,eventstatus) => {
    //     try {
    //         const userRef = ref(database, `users/${userId}`);
    //         await update(userRef, {
    //             status: eventstatus == 'approved'?"deactivate":"approved",
    //         });
    //         setRender1(!render1)
    //         console.log("updated");
    //     } catch (error) {
    //         console.error('Error updating status:', error.message);
    //     }
    // };

    const handleActivate = async (userId, eventstatus) => {
        try {
            const userRef = ref(database, `users/${userId}`);
            await update(userRef, {
                status: eventstatus === 'approved' ? "deactivate" : "approved",
            });
    
            // Update the selectedSchool or schools[0] with the new status
            if (selectedSchool) {
                setSelectedSchool(prevState => ({
                    ...prevState,
                    status: eventstatus === 'approved' ? "deactivate" : "approved"
                }));
            } else {
                setUserData(prevState => {
                    const updatedData = prevState.map(item => {
                        if (item.id === userId) {
                            return {
                                ...item,
                                status: eventstatus === 'approved' ? "deactivate" : "approved"
                            };
                        }
                        return item;
                    });
                    return updatedData;
                });
            }
    
            console.log("updated");
        } catch (error) {
            console.error('Error updating status:', error.message);
        }
    };
    

    return (
        <Main>
            <div className="px-4 w-full">
                <div className="w-full flex  mt-12">
                    <div className="bg-[#f3f3f3] mx-2 w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Total Schools</p>
                            {/* <button><IoMdMore className='w-[24px] text-[24px]' /></button> */}
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{schools?.length}</p>
                            {/* <span className='flex items-center text-[14px] text-green-600 bg-green-600 bg-opacity-20 px-[4px] rounded'><FaArrowUpLong className='mr-1 w-[12px] h-[12px]' /> 20%</span> */}
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] mx-2 w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Pending Schools</p>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{pendingSchools?.length}</p>
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] mx-2 w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Approved Schools</p>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{approvedSchools?.length}</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="w-[70%] px-3">
                        <div className="mt-8">
                            <div className="w-full bg-primary bg-opacity-10 text-[18px] font-bold flex justify-between items-center rounded-t-lg p-4">
                                <div className="w-[35%]">
                                    school Email
                                </div>
                                <div className="w-[45%]">
                                    School Name
                                </div>
                                <div className="w-[20%]">
                                    Action
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            {schools?.map((data, i) => (
                                <div onClick={() => setSelectedSchool(data)} className="rounded-lg my-2 py-2" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                                    <div className="w-full text-[18px] font-semibold flex justify-between items-center p-2">
                                        <div className="w-[35%]">{data?.email}</div>
                                        <div className="w-[45%]">{data?.name}</div>
                                        <div className="w-[20%]">Edit &nbsp; Delete</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[30%] rounded-lg px-2 mt-8 h-full max-h-[500px] min-h-[300px]" style={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 15px' }}>
                        <div className="p-2">
                            <p className='text-lg font-bold p-2'>School Record</p>
                            <div className="w-full">
                                <div className="flex justify-between">
                                    <p className='font-bold'>Name</p>
                                    <p>{selectedSchool ? selectedSchool?.name : schools[0]?.name}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>Email</p>
                                    <p>{selectedSchool ? selectedSchool?.email : schools[0]?.email}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>location</p>
                                    <p>Lorem ipsum dolor.</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>Address</p>
                                    <p>Lorem ipsum dolor sit.</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>Date</p>
                                    <p>{selectedSchool ? selectedSchool?.date : schools[0]?.date}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>status</p>
                                    <p>{selectedSchool ? selectedSchool?.status : schools[0]?.status}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>Assigned Doctor</p>
                                    <p>{assignedDoctor && assignedDoctor[0]?.doctorName}</p>
                                </div>
                                <div className="flex items-center justify-center py-2">
                                <button className="bg-blue-900 rounded py-2 w-full text-white font-bold" onClick={()=>handleActivate(selectedSchool ? selectedSchool?.id : schools[0]?.id, selectedSchool ? selectedSchool.status : schools[0]?.status)}>{selectedSchool ? (selectedSchool?.status=="approved" ? "Deactivate":"Activate") : (schools[0]?.status=="approved" ? "Deactivate":"Activate")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}

export default School