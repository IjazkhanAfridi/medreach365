import React, { useEffect, useState } from 'react'
import SchoolLayout from '../../layout/SchoolLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import DoctorLayout from '../../layout/DoctorLayout'
import { get, onValue, ref } from 'firebase/database'
import { database } from "../../firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useDataContext } from '../../context/DataContext'

const DoctorHome = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [students, setStudents] = useState([]);
    const [userId, setUserId] = useState(null);
    const { studentData, refresh } = useDataContext()
    console.log('studentData: ', studentData);
    const data = studentData && studentData?.medicalRecords && Object.values(studentData?.medicalRecords)
    const initialData = students && students?.length >= 0 && students[0]?.medicalRecords && Object.values(students[0]?.medicalRecords)
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
        const studentsRef = ref(database, `schools/${location?.state?.data}/students`);

        const unsubscribe = onValue(studentsRef, (snapshot) => {
            if (snapshot.exists()) {
                const studentsData = snapshot.val();
                const studentsArray = Object.keys(studentsData).map((studentId) => ({
                    firebaseId: studentId,
                    ...studentsData[studentId],
                }));
                setStudents(studentsArray);
            } else {
                console.log("data not found");
            }
        });

        return () => unsubscribe();

        // const studentsRef = ref(database, `schools/${location?.state?.data}/students`);
        // get(studentsRef).then((snapshot) => {
        //     if (snapshot.exists()) {
        //         const studentsData = snapshot.val();
        //         const studentsArray = Object.keys(studentsData).map((studentId) => ({
        //             firebaseId: studentId,
        //             ...studentsData[studentId],
        //         }));
        //         setStudents(studentsArray);
        //     } else {
        //         console.log("data not found");
        //     }
        // });

    }, [userId]);



    return (
        <DoctorLayout students={students}>
            <div className="flex item-center justify-end p-3 ">
                <button  onClick={() => navigate("/addrecord", { state: { schoolId: location?.state?.data, studentId: studentData ? studentData?.firebaseId : students[0]?.firebaseId } })} className='bg-blue-800 px-4 py-2 rounded-[22px] text-white font-semibold' >
                    Add Record
                </button>
            </div>
            <div className='w-full flex justify-between'>
                <div className="w-[20%] p-4">
                    <div className="bg-[#f3f3f3]  w-full rounded-lg">
                        <div className="bg-blue-900 text-white flex justify-between items-center px-2 py-4 rounded-t-lg font-bold"><p>Name </p><p>{studentData ? studentData?.firstName + studentData?.lastName : students[0]?.firstName + students[0]?.lastName}</p></div>
                        <div className="flex items-center justify-between px-3">
                            <p className='font-bold'>ID</p>
                            <p className='text-[14px] text-blue-700 font-bold'>{studentData ? studentData?.id : students[0]?.id}</p>
                        </div>
                        <div className=" p-3 ">
                            <p className='font-bold'>About</p>
                            <p className='text-[14px]'>{studentData ? studentData?.bio : students[0]?.bio}</p>
                        </div>
                    </div>
                </div>
                <div className="w-[50%] p-4">
                    <div className="bg-[#f3f3f3] w-full rounded-lg p-4">
                        <p className='text-blue-700 font-bold text-lg'>Medical history</p>
                        {studentData ? (
                            data ?
                                <div className='whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: data[0]?.record }} />
                                :
                                <p>No Data Found</p>
                        ) : (
                            initialData && (
                                <div className='whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: initialData[0]?.record }} />
                            )
                        )

                        }
                    </div>
                </div>
                <div className="w-[30%] p-4">
                    <div className="bg-[#f3f3f3] w-full rounded-lg p-3">
                        <p className='text-blue-700 font-bold text-lg'>Medical History Record </p>
                        {studentData ? (
                            data ?
                                data?.map((data) => (
                                    <div className=' whitespace-pre-wrap pt-2' dangerouslySetInnerHTML={{ __html: data?.record }} />
                                ))
                                :
                                <p>No Data Found</p>
                        ) : (
                            initialData && initialData?.map((data) => (
                                <div className=' whitespace-pre-wrap pt-2' dangerouslySetInnerHTML={{ __html: data?.record }} />
                            ))
                        )
                        }
                    </div>
                </div>
            </div>
        </DoctorLayout>
    )
}

export default DoctorHome