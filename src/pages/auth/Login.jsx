import React, { useEffect, useState } from 'react'
import MyInput from '../../common/MyInput';
import MyButton from '../../common/MyButton';
import useApi from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';

const Login = () => {
    const { setContextName, setContextEmail } = useDataContext()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Fetch additional user information from the Realtime Database
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                const { name, category } = userData;
                // You can use or store the name and category as needed
                localStorage?.setItem("token",user?.accessToken)
                // Redirect to the desired page after successful login
                setLoading(false)
                navigate("/")
            } else {
                alert('User data not found in the database.');
                setLoading(false)
            }
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert("something went wrong")
            setLoading(false)
        }
    };

    return (
        <div className='flex w-full h-[100vh]'>
            <div className="w-[40%] flex justify-center items-center bg-primary">
                <div className="w-[90%] h-screen flex items-center justify-center flex-col" >
                    <p className='text-[32px] px-2 py-4 text-white font-bold text-[white]'>Welcome back!</p>
                    <MyButton style={{ minWidth: "300px", padding: "30px auto", backgroundColor: "transparent", border: "1px solid white", color: "white" }} onClick={()=>navigate("/signup")}>Sign Up</MyButton>
                </div>
            </div>
            <div className="w-[60%] py-3 px-2 md:py-6 md:px-3 flex items-center justify-center">
                <div className="w-11/12 md:w-4/5 mx-auto">
                    <div className="">
                        <p className='text-[32px] px-2 text-black font-bold text-primary'>Login</p>
                    </div>
                    <form className='w-full'>
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
                            onChange={(e)=>setPassword(e.target.value)}
                            required={true}
                            label={"Password"}
                        />
                        <div className="text-[white] flex justify-center py-6">
                            <MyButton style={{ minWidth: "300px", padding: "30px auto" }} onClick={handleLogin}>{loading?"Loading...":"Login"}</MyButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login