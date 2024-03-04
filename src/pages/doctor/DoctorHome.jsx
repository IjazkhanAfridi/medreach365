import React, { useEffect, useState } from 'react';
import SchoolLayout from '../../layout/SchoolLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../layout/DoctorLayout';
import { get, onValue, ref } from 'firebase/database';
import { database } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDataContext } from '../../context/DataContext';
import ZegoChat from '../../common/ZegoChat';
import ZegVideoCall from '../../common/ZegVideoCall';
import ZegoAudio from '../../common/ZegoAudio';

const DoctorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [getMail, setGetMail] = useState();
  const [students, setStudents] = useState([]);
  const [userId, setUserId] = useState(null);
  const { studentData, refresh } = useDataContext();
  const [activeComponent, setActiveComponent] = useState(null);

  const handleButtonClick = (component) => {
    if (component !== activeComponent) {
      setActiveComponent(component);
    }
  };

  const data =
    studentData &&
    studentData?.medicalRecords &&
    Object.values(studentData?.medicalRecords);
  const initialData =
    students &&
    students?.length >= 0 &&
    students[0]?.medicalRecords &&
    Object.values(students[0]?.medicalRecords);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setGetMail(auth?.currentUser?.email?.split('@')[0]);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const studentsRef = ref(
      database,
      `schools/${location?.state?.data}/students`
    );

    const unsubscribe = onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const studentsData = snapshot.val();
        const studentsArray = Object.keys(studentsData).map((studentId) => ({
          firebaseId: studentId,
          ...studentsData[studentId],
        }));
        setStudents(studentsArray);
      } else {
        console.log('data not found');
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
      <div className='flex item-center justify-end p-3'>
        <button
          onClick={() =>
            navigate('/addrecord', {
              state: {
                schoolId: location?.state?.data,
                studentId: studentData
                  ? studentData?.firebaseId
                  : students[0]?.firebaseId,
              },
            })
          }
          className='bg-blue-800 px-4 py-2 rounded-[22px] text-white font-semibold'
        >
          Add Record
        </button>
      </div>
      <div className='w-full h-full flex justify-between'>
        <div className='w-[20%] h-full p-4 flex flex-col justify-between'>
          <div className='bg-[#f3f3f3] w-full rounded-lg flex flex-col justify-between h-full max-h-[500px] overflow-y-auto custom-scrollbar'>
            <div className='bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg'>
              <p>Name </p>
              <p>
                {studentData
                  ? studentData?.firstName + studentData?.lastName
                  : students[0]?.firstName + students[0]?.lastName}
              </p>
            </div>
            <div className='flex items-center justify-between px-3'>
              <p className='font-semibold'>ID</p>
              <p className='text-[14px] text-blue-700'>
                {studentData ? studentData?.id : students[0]?.id}
              </p>
            </div>
            <div className='p-4 flex-grow'>
              <div className=' h-full'>
                <p className='font-semibold'>About</p>
                <p className='text-[14px]'>
                  {studentData ? studentData?.bio : students[0]?.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[45%] p-4 flex flex-col justify-between'>
          <div className='bg-[#f3f3f3] w-full rounded-lg flex flex-col justify-between h-full max-h-[500px] overflow-y-auto custom-scrollbar'>
            <div className='bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg'>
              <p className='font-bold '>Medical history</p>
            </div>
            <div className='p-4 flex-grow'>
              {studentData ? (
                data ? (
                  <div
                    className='pt-2 h-full'
                    dangerouslySetInnerHTML={{ __html: data[0]?.record }}
                  />
                ) : (
                  <p>No Data Found</p>
                )
              ) : (
                initialData && (
                  <div
                    className='pt-2 h-full'
                    dangerouslySetInnerHTML={{ __html: initialData[0]?.record }}
                  />
                )
              )}
            </div>
          </div>
        </div>
        <div className='w-[35%] p-4 flex flex-col justify-between'>
          <div className='bg-[#f3f3f3] w-full rounded-lg flex flex-col justify-between h-full max-h-[500px]'>
            <div className='bg-blue-900 text-white flex justify-between font-bold items-center px-2 py-4 rounded-t-lg'>
              <p className='font-bold'>Medical History Record List</p>
            </div>
            <div className='p-3 flex-grow h-full max-h-[500px] overflow-y-auto custom-scrollbar'>
              {studentData ? (
                data && data?.length > 0 ? (
                  <ul className='list-disc px-3'>
                    {data?.map((item, index) => (
                      <li key={index} className='pb-3'>
                        <div className='flex justify-between border-b-2 border-blue-700'>
                          <p className='font-bold text-blue-700'>
                            Uploaded at {item?.time}
                          </p>
                          <p className='font-bold text-blue-700'>
                            {item?.date}
                          </p>
                        </div>
                        <div
                          dangerouslySetInnerHTML={{ __html: item?.record }}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Data Found</p>
                )
              ) : initialData && initialData?.length >= 0 ? (
                <ul className='list-disc px-3'>
                  {initialData?.map((item, index) => (
                    <li key={index} className='pb-3'>
                      <div className='flex justify-between border-b-2 border-blue-700'>
                        <p className='font-bold text-blue-700'>
                          Uploaded at {item?.time}
                        </p>
                        <p className='font-bold text-blue-700'>{item?.date}</p>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: item?.record }} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Data Found</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className='w-full relative flex relative justify-center'>
        <div className='w-[50%] '>
          <ZegoChat user={getMail} />
        </div>
      </div> */}
      <div className='w-full relative flex'>
        <div className='w-[100px] h-full min-h-[370px] flex flex-col bg-blue-900 rounded-lg items-center justify-around mx-5'>
          <div className='cursor-pointer' onClick={() => handleButtonClick('video')}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 576 512'
              width={'50px'}
              height={'50px'}
            >
              <path
                fill='white'
                d='M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z'
              />
            </svg>
          </div>
          <div  className='cursor-pointer' onClick={() => handleButtonClick('audio')} >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              width={'50px'}
              height={'50px'}
            >
              <path
                fill='white'
                d='M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z'
              />
            </svg>
          </div>
          <div className='cursor-pointer' onClick={() => setActiveComponent(null)}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              width={'50px'}
              height={'50px'}
            >
              <path
                fill='white'
                d='M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z'
              />
            </svg>
          </div>
        </div>
        <div className='w-full'>
          <div className='relative h-full w-[60%] bg-gray-100 flex items-center justify-center rounded-lg'>
            {activeComponent === 'video' && <ZegVideoCall />}
            {activeComponent === 'audio' && <ZegoAudio />}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorHome;
