import React, { useEffect, useState } from 'react'
import Main from '../../layout/Main'
import { IoMdMore } from 'react-icons/io'
import { FaArrowDownLong, FaArrowUpLong, FaFilePen } from 'react-icons/fa6'
import { child, get, onValue, ref, update } from 'firebase/database'
import { database } from "../../firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const Doctor = () => {
    const [doctors, setDoctors] = useState(null);
    const [render, setRender] = useState(false);
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    const [selectedSchoolName, setSelectedSchoolName] = useState('');
    const [allSchools, setAllSchools] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState([]);
    const doctor = userData?.filter(data => data?.category == "doctor")
    const school = userData?.filter(data => data?.category == "school")
    const [selectedDoctor, setselectedDoctor] = useState(null);
    const pendingdoctor = doctor?.filter(data => data?.status == "pending")
    const approveddoctor = doctor?.filter(data => data?.status == "approved")
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
    }, [isAuthenticated]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const doctorsRef = ref(database, `doctors/${doctor && selectedDoctor ? selectedDoctor?.id : doctor[0]?.id}/assignedSchools`);
        const schoolsRef = ref(database, `schools/${selectedSchoolId}/doctors`);
        const unsubscribeDoctors = onValue(doctorsRef, (snapshot) => {
            if (snapshot.exists()) {
                const assignedSchools = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id,
                    ...data
                }));
                setDoctors(assignedSchools);
            }
        });

        const unsubscribeSchools = onValue(schoolsRef, (snapshot) => {
            if (snapshot.exists()) {
                const schoolArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id,
                    ...data
                }));
                setAllSchools(schoolArray);
            }
        });

        return () => {
            unsubscribeDoctors();
            unsubscribeSchools();
        };
    }, [userId, selectedDoctor, selectedSchoolId, render]);

    const handleSchoolChange = (e) => {
        const selectedId = e.target.value;
        const selectedSchool = school.find((school) => school.id === selectedId);

        const selectedSchoolId = selectedSchool ? selectedSchool.id : "";
        const selectedSchoolName = selectedSchool ? selectedSchool.name : "";

        setSelectedSchoolId(selectedSchoolId);
        setSelectedSchoolName(selectedSchoolName);
    };


    const handleAssignSchool = () => {
        if (selectedSchoolId) {
            const doctorRef = ref(database, `doctors/${selectedDoctor ? selectedDoctor?.id : doctor[0]?.id}`);
            const schoolRef = ref(database, `schools/${selectedSchoolId}`);
            update(doctorRef, {
                [`assignedSchools/${selectedSchoolId}`]: {
                    schoolId: selectedSchoolId,
                    schoolName: selectedSchoolName
                }
            });

            update(schoolRef, {
                [`doctors/${selectedDoctor ? selectedDoctor?.id : doctor[0]?.id}`]: {
                    doctorId: selectedDoctor ? selectedDoctor?.id : doctor[0]?.id,
                    doctorName: selectedDoctor ? selectedDoctor?.name : doctor[0]?.name
                }
            });
        }
    };

    return (
        <Main>
            <div className="px-4 w-full">
                <div className="w-full flex  mt-12">
                    <div className="bg-[#f3f3f3] mx-2 w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Total Doctors</p>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{doctor?.length}</p>
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] mx-2 w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Approved Doctors</p>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{approveddoctor?.length}</p>
                        </div>
                    </div>
                    <div className="bg-[#f3f3f3] mx-2 w-[24%] p-2 rounded-lg bg-opacity-50">
                        <div className="flex justify-between p-1">
                            <p className='text-[24px] font-bold opacity-80'>Pending Doctors</p>
                        </div>
                        <div className="flex items-center justify-between p-1">
                            <p className='text-[24px] font-bold'>{pendingdoctor?.length}</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="w-[70%] px-3">
                        <div className="mt-8">
                            <div className="w-full bg-primary bg-opacity-10 text-[18px] font-bold flex justify-between items-center rounded-t-lg p-4">
                                <div className="w-[20%]">
                                    Name
                                </div>
                                <div className="w-[30%]">
                                    Email
                                </div>
                                <div className="w-[30%]">
                                    specialzation
                                </div>
                                <div className="w-[20%]">
                                    Action
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            {doctor?.map((data) => (
                                <div onClick={() => setselectedDoctor(data)} className="rounded-lg my-2 py-2" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                                    <div className="w-full text-[18px] font-semibold flex justify-between items-center p-2">
                                        <div className="w-[20%]">{data?.name}</div>
                                        <div className="w-[30%] text-blue-700">{data?.email}</div>
                                        <div className="w-[30%]">Lorem ipsum dolor.</div>
                                        <div className="w-[20%]">Delete</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[30%] rounded-lg px-2 mt-8" style={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 15px' }}>
                        <div className="">
                            <p className='text-lg font-bold p-2'>Doctor view</p>
                            <div className="w-full">
                                <div className="flex justify-between">
                                    <p className='font-bold'>Name</p>
                                    <p>{selectedDoctor ? selectedDoctor?.name : doctor[0]?.name}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>Email</p>
                                    <p>{selectedDoctor ? selectedDoctor?.email : doctor[0]?.email}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className='font-bold'>specialty</p>
                                    <p>Lorem ipsum dolor.</p>
                                </div>
                                <div className="">
                                    <p className='font-bold'>Assigned School</p>
                                    {doctors?.map((data) => (
                                        <div className="flex justify-between bg-blue-50 px-2 py-1 rounded-full my-1">
                                            <p className='font-semibold'>{data?.schoolName}</p>
                                            <p>Delete</p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <select className='flex font-bold w-full bg-blue-200 rounded-md border border-black py-2 my-1' value={selectedSchoolId} onChange={(e) => handleSchoolChange(e)}>
                                        <option value="">Assign School</option>
                                        {school && school?.filter(school => !doctors?.some(doctor => doctor?.schoolId === school?.id)).map((school) => (
                                            <option key={school?.id} value={school?.id}>
                                                {school?.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button className='w-[50%] mx-auto flex items-center justify-center bg-blue-700 rounded-full text-white px-3 py-1 my-2 font-bold text-lg' onClick={handleAssignSchool}>Assign School</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}

export default Doctor