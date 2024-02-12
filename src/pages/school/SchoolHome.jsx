import React, { useEffect, useState } from 'react'
import SchoolLayout from '../../layout/SchoolLayout'
import { get, onValue, ref } from 'firebase/database';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { database } from "../../firebase"
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
const SchoolHome = () => {
    const [students, setStudents] = useState([]);
    const [userId, setUserId] = useState(null);
    const { studentData } = useDataContext()
    const data = studentData && studentData?.medicalRecords && Object?.values(studentData?.medicalRecords)
    const initialData = students || students?.length >= 0 && Object?.values(students[0]?.medicalRecords)
    const navigate = useNavigate()

    useEffect(() => {
        const auth = getAuth();
        const isAuthenticated = !!auth.currentUser;
        if (isAuthenticated == false) {
            navigate("/login")
        }
    }, [])

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
        const studentsRef = ref(database, `schools/${userId}/students`);
        get(studentsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const studentsData = snapshot.val();
                const studentsArray = Object?.keys(studentsData)?.map((studentId) => ({
                    firebaseId: studentId,
                    ...studentsData[studentId],
                }));
                setStudents(studentsArray);
            } else {
                console.log("data not found");
            }
        });
    }, [userId]);


    return (
        <SchoolLayout students={students}>
            <div className='w-full h-full flex justify-between'>
                <div className="w-[20%] h-full p-4 flex flex-col justify-between">
                    <div className="bg-[#f3f3f3]  w-full rounded-lg flex flex-col justify-between h-full max-h-[500px] overflow-y-auto custom-scrollbar">
                        <div className="bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg"><p>Name </p><p>{studentData ? studentData?.firstName + studentData?.lastName : students[0]?.firstName + students[0]?.lastName}</p></div>
                        <div className="flex items-center justify-between px-3">
                            <p className='font-semibold'>ID</p>
                            <p className='text-[14px] text-blue-700'>{studentData ? studentData?.id : students[0]?.id}</p>
                        </div>
                        <div className="p-3 flex-grow">
                            <p className='font-semibold'>About</p>
                            <p className='text-[14px]'>{studentData ? studentData?.bio : students[0]?.bio}</p>
                        </div>
                    </div>
                </div>
                <div className="w-[45%] p-4 flex flex-col justify-between">
                    <div className="bg-[#f3f3f3] w-full rounded-lg flex flex-col justify-between h-full max-h-[500px] overflow-y-auto custom-scrollbar">
                        <div className="bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg">
                            <p className='font-bold '>Medical history</p>
                        </div>
                        <div className=" p-4 flex-grow">
                            {studentData ? (
                                data ?
                                    <div className='pt-2 h-full' dangerouslySetInnerHTML={{ __html: data[0]?.record }} />
                                    :
                                    <p>No Data Found</p>
                            ) : (
                                initialData && (
                                    <div className='pt-2 h-full' dangerouslySetInnerHTML={{ __html: initialData[0]?.record }} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="w-[35%] p-4 flex flex-col justify-between">
                    <div className="bg-[#f3f3f3] w-full rounded-lg flex flex-col justify-between h-full max-h-[500px] ">
                        <div className="bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg">
                            <p className='font-bold'>Medical History Record List</p>
                        </div>
                        <div className="p-3 flex-grow h-full overflow-y-auto custom-scrollbar">
                            {studentData ? (
                                data && data?.length > 0 ? (
                                    <ul className='list-disc px-3'>
                                        {data?.map((item, index) => (
                                            <li key={index} className='pb-3'>
                                                <div className="flex justify-between border-b-2 border-blue-700">
                                                    <p className="font-bold text-blue-700">Uploaded at {item?.time}</p>
                                                    <p className="font-bold text-blue-700">{item?.date}</p>
                                                </div>
                                                <div dangerouslySetInnerHTML={{ __html: item?.record }} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No Data Found</p>
                                )
                            ) : (
                                initialData && initialData?.length >= 0 ? (
                                    <ul className='list-disc px-3'>
                                        {initialData?.map((item, index) => (
                                            <li key={index} className='pb-3'>
                                                <div className="flex justify-between border-b-2 border-blue-700">
                                                    <p className="font-bold text-blue-700">Uploaded at {item?.time}</p>
                                                    <p className="font-bold text-blue-700">{item?.date}</p>
                                                </div>
                                                <div dangerouslySetInnerHTML={{ __html: item?.record }} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No Data Found</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SchoolLayout>
    )
}

export default SchoolHome