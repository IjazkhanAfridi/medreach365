import React, { useEffect, useState } from 'react';
import DoctorLayout from '../../layout/DoctorLayout'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MyButton from '../../common/MyButton';
import { push, ref, set } from 'firebase/database';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from "../../firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDataContext } from '../../context/DataContext';

const DoctorForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const { setStudentData } = useDataContext();
    const [userId, setUserId] = useState(null);
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
    // const handleSubmit = () => {
    //     const medicalRecordsRef = ref(database, `schools/${location?.state?.schoolId}/students/${location?.state?.studentId}/medicalRecords`);
    //     const newRecordRef = push(medicalRecordsRef);
    //     set(newRecordRef, {
    //         record: value,
    //     }).then(() => {
    //         console.log('Record added successfully.');
    //         setRefresh(!refresh)
    //         navigate(-1, { state: { refreshData: true } })
    //     }).catch((error) => {
    //         console.error('Error adding record: ', error);
    //     });
    // };

    let myDate = new Date();
    let hours = myDate.getHours();
    let minutes = myDate.getMinutes();
    let day = myDate.getDate();
    let month = myDate.getMonth() + 1;
    let year = myDate.getFullYear();
    const handleSubmit = () => {


        const medicalRecordsRef = ref(database, `schools/${location?.state?.schoolId}/students/${location?.state?.studentId}/medicalRecords`);
        const newRecordRef = push(medicalRecordsRef);
        set(newRecordRef, {
            record: value,
            date: day + "/" + month + "/" + year,
            time: hours + ":" + minutes
        }).then(() => {
            console.log('Record added successfully.');
            setStudentData((prevData) => ({
                ...prevData,
                medicalRecords: {
                    ...prevData?.medicalRecords,
                    newRecordId: { record: value, date: day + "/" + month + "/" + year, time: hours + ":" + minutes },
                },
            }));
            navigate(-1);
        }).catch((error) => {
            console.error('Error adding record: ', error);
        });
    };
    return (
        <DoctorLayout>
            <div className="p-4">
                <div className="text-blue-700 py-4 font-bold p-4">Add Student Health Record</div>
                <ReactQuill theme="snow" value={value} onChange={setValue} className='h-[400px] p-4' />
            </div>
            <div className="ml-auto mr-0 px-8 mt-6">
                <MyButton onClick={handleSubmit} style={{ marginLeft: "auto", marginRight: "0px" }}>
                    Submit
                </MyButton>
            </div>
        </DoctorLayout>
    )
}

export default DoctorForm