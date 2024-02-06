import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from "../../firebase"
import MyInput from '../../common/MyInput';
import MyButton from '../../common/MyButton';

const SignUp = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDoctorSignUp, setIsDoctorSignUp] = useState(false)
    const navigate = useNavigate()
    const handleSignUp = async (e) => {
        e.preventDefault();
        let myDate = new Date();
        let day = myDate.getDate();
        let month = myDate.getMonth() + 1;
        let year = myDate.getFullYear();
        console.log(month + '/' + day + '/' + year);
        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return;
        }
        const auth = getAuth(app);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User authenticated successfully:', user);

            const db = getDatabase(app);
            const userRef = ref(db, 'users/' + user.uid);
            set(userRef, {
                name: name,
                email: email,
                category: isDoctorSignUp ? "doctor" : 'school',
                status: "pending",
                date: month + '/' + day + '/' + year
            });
            localStorage.getItem("token", user?.accessToken)
            navigate("/")
        } catch (error) {
            console.error('Error signing up:', error.message);
        }
    };
    return (
        <div className='flex w-full h-[100vh]'>
            <div className="w-[40%] flex flex-col justify-center items-center bg-primary">
                <div className="w-[90%] py-4 flex items-center justify-center flex-col" >
                    <p className='text-[32px] px-2 text-black font-semibold text-white'>Sign Up as a {isDoctorSignUp ? "School" : "Doctor"}</p>
                    <MyButton style={{ minWidth: "300px", padding: "30px auto", backgroundColor: "transparent", border: "1px solid white", color: "white" }} onClick={() => setIsDoctorSignUp(!isDoctorSignUp)}>{isDoctorSignUp ? "School" : "Doctor"} Signup</MyButton>
                </div>
                <div className="w-[90%] flex items-center justify-center flex-col" >
                    <p className='text-[28px] px-2 text-black font-bold text-white'>OR</p>
                    <p className='text-[24px] px-2 py-2 text-black font-semibold text-white'>Already have an Account</p>
                    <MyButton style={{ minWidth: "300px", padding: "30px auto", backgroundColor: "transparent", border: "1px solid white", color: "white" }} onClick={() => navigate("/login")}>Log In</MyButton>
                </div>
            </div>
            <div className="w-[60%] py-3 px-2 md:py-6 md:px-3 flex items-center justify-center">
                <div className="w-11/12 md:w-4/5 mx-auto">
                    <div className="">
                        <p className='text-[32px] px-2 text-black font-bold text-primary'>Sign Up For {isDoctorSignUp ? "Doctor" : "School"}</p>
                    </div>
                    <form className='w-full' onSubmit={handleSignUp}>
                        <MyInput
                            type='name'
                            placeholder=''
                            label={"Name"}
                            required={true}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <MyInput
                            type='email'
                            placeholder=''
                            label={"Email Address"}
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <MyInput
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // isValid={false}
                            // errorMessage='somthing went wrong'
                            required={true}
                            label={"Password"}
                        />
                        <MyInput
                            type="password"
                            placeholder=""
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            // isValid={false}
                            // errorMessage='somthing went wrong'
                            required={true}
                            label={"Confirm Password"}
                        />
                        <div className="text-[white] flex justify-center py-6">
                            <MyButton style={{ minWidth: "300px", padding: "30px auto" }} type={"submit"}> Sign Up </MyButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp