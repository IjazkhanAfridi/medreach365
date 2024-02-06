import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, } from 'react-router-dom'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import SchoolHome from './pages/school/SchoolHome'
import DoctorHome from './pages/doctor/DoctorHome'
import DoctorForm from './pages/doctor/DoctorForm'
import StudentForm from './pages/school/StudentForm'
import School from './pages/admin/School'
import Doctor from './pages/admin/Doctor'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { get, getDatabase, ref } from 'firebase/database'
import AssignedSchool from './pages/doctor/AssignedSchool'
import useAuth from './hooks/useAuth'
import { database } from "./firebase"
import NotApproved from './common/NotApproved'

// const PrivateRoute = ({ children }) => {
//     const isAuthenticated = localStorage?.getItem("token");
//     return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

const PrivateRoute = ({ children, allowedRoles }) => {
    const [userData, setUserData] = useState(null)
    const auth = getAuth();
    const user = useAuth();

    useEffect(() => {
        const userRef = ref(database, `users/${user?.uid}`);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.val())
            } else {
                console.log("some error");
            }
        }).catch(err => console.log("catch error", err))
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userData?.category)) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};



const Router = () => {
    const [userData, setUserData] = useState(null)
    const auth = getAuth();
    const user = useAuth();

    useEffect(() => {
        const userRef = ref(database, `users/${user?.uid}`);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.val())
            } else {
                console.log("some error");
            }
        }).catch(err => console.log("catch error", err))
    }, [user]);
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route exact path="/signup" element={<SignUp />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route path="/" element={userData?.category == "doctor" ? <PrivateRoute allowedRoles={['doctor']}> {userData?.status !== "approved" ? <NotApproved /> : <AssignedSchool />}</PrivateRoute> : userData?.category == "school" ? <PrivateRoute allowedRoles={['school']}>{userData?.status !== "approved" ? <NotApproved /> : <SchoolHome />}</PrivateRoute> : <PrivateRoute allowedRoles={['admin']}>{userData?.status !== "approved" ? <NotApproved /> : <Home />}</PrivateRoute>} />
                    <Route path="/listedschool" element={<PrivateRoute allowedRoles={['admin']}>{userData?.status !== "approved" ? <NotApproved /> : <School />}</PrivateRoute>} />
                    <Route path="/listeddoctors" element={<PrivateRoute allowedRoles={['admin']}>{userData?.status !== "approved" ? <NotApproved /> : <Doctor />}</PrivateRoute>} />
                    <Route path="/doctor" element={<PrivateRoute allowedRoles={['doctor']}>{userData?.status !== "approved" ? <NotApproved /> : <DoctorHome />}</PrivateRoute>} />
                    <Route path="/addrecord" element={<PrivateRoute allowedRoles={['doctor']}>{userData?.status !== "approved" ? <NotApproved /> : <DoctorForm />}</PrivateRoute>} />
                    <Route path="/addstudent" element={<PrivateRoute allowedRoles={['school']}>{userData?.status !== "approved" ? <NotApproved /> : <StudentForm />}</PrivateRoute>} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default Router