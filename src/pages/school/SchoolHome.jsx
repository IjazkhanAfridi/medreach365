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
    const data = studentData && studentData?.medicalRecords && Object.values(studentData?.medicalRecords)
    const initialData = students && students?.length > 0 && Object.values(students[0]?.medicalRecords)
    const navigate = useNavigate()

    useEffect(()=>{
        const auth = getAuth();
        const isAuthenticated = !!auth.currentUser;
        if(isAuthenticated == false){
            navigate("/login")
        }
    },[])
    
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
                const studentsArray = Object.keys(studentsData).map((studentId) => ({
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
            <div className='w-full flex justify-between'>
                <div className="w-[20%] p-4">
                    <div className="bg-[#f3f3f3]  w-full rounded-lg">
                        <div className="bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg"><p>Name </p><p>{studentData ? studentData?.firstName + studentData?.lastName : students[0]?.firstName + students[0]?.lastName}</p></div>
                        <div className="flex items-center justify-between px-3">
                            <p className='font-semibold'>ID</p>
                            <p className='text-[14px] text-blue-700'>{studentData ? studentData?.id : students[0]?.id}</p>
                        </div>
                        <div className=" p-3 ">
                            <p className='font-semibold'>About</p>
                            <p className='text-[14px]'>{studentData ? studentData?.bio : students[0]?.bio}</p>
                        </div>
                    </div>
                </div>
                <div className="w-[50%] p-4">
                    <div className="bg-[#f3f3f3] w-full rounded-lg p-4">
                        <p className='text-blue-700 font-bold '>Medical history</p>
                        {studentData ? (
                            data ?
                                <div className='pt-2' dangerouslySetInnerHTML={{ __html: data[0]?.record }} />
                                :
                                <p>No Data Found</p>
                        ) : (
                            initialData && (
                                <div className='pt-2' dangerouslySetInnerHTML={{ __html: initialData[0]?.record }} />
                            )
                        )

                        }
                    </div>
                </div>
                <div className="w-[30%] p-4">
                    <div className="bg-[#f3f3f3] w-full rounded-lg p-3">
                        <p className='text-blue-700 font-bold'>Medical History Record </p>
                        {studentData ? (
                            data ?
                                data?.map((data) => (
                                    <div dangerouslySetInnerHTML={{ __html: data?.record }} />
                                ))
                                :
                                <p>No Data Found</p>
                        ) : (
                            initialData && initialData?.map((data) => (
                                <div dangerouslySetInnerHTML={{ __html: data?.record }} />
                            ))
                        )
                        }
                    </div>
                </div>
            </div>
        </SchoolLayout>
    )
}

export default SchoolHome