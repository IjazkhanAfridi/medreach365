import React, { useEffect, useState } from 'react'
import SchoolLayout from '../../layout/SchoolLayout'
import MyInput from '../../common/MyInput'
import MyButton from '../../common/MyButton'
import { push, ref, set } from 'firebase/database'
import { database } from "../../firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const StudentForm = () => {
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [id, setId] = useState(null)
  const [bio, setBio] = useState(null)
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate()
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

  const handleAddStudent = async () => {
    const studentsRef = ref(database, `schools/${userId}/students`);
    const newStudentRef = push(studentsRef);
    set(newStudentRef, {
      firstName,
      lastName,
      id,
      bio,
    }).then(() => {
      navigate(-1)
    });
  };

  return (
    <SchoolLayout>
      <div className="p-4">
        <div className="text-blue-700 font-bold">Add Student Data</div>
        <div className="flex w-full">
          <div className="px-2 w-full">
            <MyInput onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder='Enter First Name' label={"First Name"} />
          </div>
          <div className="px-2 w-full">
            <MyInput onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder='Enter Last Name' label={"Last Name"} />
          </div>
        </div>
        <div className="px-2">
          <MyInput onChange={(e) => setId(e.target.value)} value={id} placeholder='Enter Student ID' label={"ID"} />
        </div>
        <div className="px-2">
          <MyInput onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Enter Student Bio' label={"Bio"} />
        </div>
        <div className="ml-auto mr-0 px-2 mt-2">
          <MyButton onClick={handleAddStudent} style={{ marginLeft: "auto", marginRight: "0px" }}>
            Submit
          </MyButton>
        </div>
      </div>
    </SchoolLayout>
  )
}

export default StudentForm