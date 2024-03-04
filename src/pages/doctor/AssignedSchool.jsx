import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {database} from "../../firebase"

const AssignedSchool = () => {
    const navigate = useNavigate()
    const [assigedSchool, setAssigendSchool] = useState(null)
    const [userId, setUserId] = useState(null);

    useEffect(()=>{
        const auth = getAuth();
        const isAuthenticated = !!auth.currentUser;
        if(!isAuthenticated){
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
        //   const doctorId = 'YOUR_DOCTOR_ID';
        const assignedSchoolsRef = ref(database, `doctors/${userId}/assignedSchools`);
        onValue(assignedSchoolsRef, async (snapshot) => {
            if (snapshot.exists()) {
                const userArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id,
                    ...data
                }));
                setAssigendSchool(userArray)
                // const assignedSchools = Object.keys(snapshot.val());
                // setAssigendSchool(assignedSchools)
            }
        });
    }, [userId]);

    return (
        <div className='min-h-screen w-full'>
            <div className="min-h-screen flex flex-col items-center justify-center ">
                <p className="text-4xl font-bold py-2">Select School</p>
                {assigedSchool?.map((data) => (
                    <div onClick={()=>navigate("/doctor",{state:{data:data?.id,schoolName:data?.schoolName}})} className="cursor-pointer w-[50%] bg-blue-300 rounded-full my-1 p-2" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                        {data?.schoolName}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssignedSchool