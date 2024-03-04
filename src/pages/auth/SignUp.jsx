import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../../firebase';
import MyInput from '../../common/MyInput';
import MyButton from '../../common/MyButton';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDoctorSignUp, setIsDoctorSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [uploadFile, setUploadFile] = useState(null);

  const handleUpladFile = (e) => {
    const selectedFile = e.target.files[0];
    setUploadFile(selectedFile);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    let myDate = new Date();
    let day = myDate.getDate();
    let month = myDate.getMonth() + 1;
    let year = myDate.getFullYear();

    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      alert('Passwords dont match');
      setLoading(false)
      return;
    }
    // Check if a file is selected
    if (!uploadFile) {
      alert('Please select a license');
      setLoading(false)
      return;
    }

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('User authenticated successfully:', user);

      // Upload file to Firebase Storage
      const storage = getStorage(app);
      const fileRef = storageRef(
        storage,
        `licenses/${user.uid}/${uploadFile.name}`
      );
      const uploadTask = uploadBytesResumable(fileRef, uploadFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          console.error('Error uploading file:', error.message);
          setLoading(false);
          alert('Something went wrong');
        },
        () => {
          // File uploaded successfully, get download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const db = getDatabase(app);
            const userRef = ref(db, 'users/' + user.uid);
            set(userRef, {
              name: name,
              email: email,
              category: isDoctorSignUp ? 'doctor' : 'school',
              status: 'pending',
              date: month + '/' + day + '/' + year,
              licenseUrl: downloadURL, // Store download URL in database
            });
            localStorage.getItem('token', user?.accessToken);
            setLoading(false);
            navigate('/');
          });
        }
      );
    } catch (error) {
      console.error('Error signing up:', error.message);
      alert('Something went wrong');
      setLoading(false);
    }
  };

  // const handleSignUp = async (e) => {
  //     e.preventDefault();
  //     setLoading(true)
  //     let myDate = new Date();
  //     let day = myDate.getDate();
  //     let month = myDate.getMonth() + 1;
  //     let year = myDate.getFullYear();
  //     if (password !== confirmPassword) {
  //         console.log("Passwords don't match");
  //         return;
  //     }
  //     const auth = getAuth(app);
  //     try {
  //         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //         const user = userCredential.user;
  //         console.log('User authenticated successfully:', user);

  //         const db = getDatabase(app);
  //         const userRef = ref(db, 'users/' + user.uid);
  //         set(userRef, {
  //             name: name,
  //             email: email,
  //             category: isDoctorSignUp ? "doctor" : 'school',
  //             status: "pending",
  //             date: month + '/' + day + '/' + year
  //         });
  //         localStorage.getItem("token", user?.accessToken)
  //         setLoading(false)
  //         navigate("/")
  //     } catch (error) {
  //         console.error('Error signing up:', error.message);
  //         alert("something went wrong")
  //     }
  // };
  return (
    <div className='flex w-full h-[100vh]'>
      <div className='w-[40%] flex flex-col justify-center items-center bg-primary'>
        <div className='w-[90%] py-4 flex items-center justify-center flex-col'>
          <p className='text-[32px] px-2 text-black font-semibold text-white'>
            Sign Up as a {isDoctorSignUp ? 'School' : 'Doctor'}
          </p>
          <MyButton
            style={{
              minWidth: '300px',
              padding: '30px auto',
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
            }}
            onClick={() => setIsDoctorSignUp(!isDoctorSignUp)}
          >
            {isDoctorSignUp ? 'School' : 'Doctor'} Signup
          </MyButton>
        </div>
        <div className='w-[90%] flex items-center justify-center flex-col'>
          <p className='text-[28px] px-2 text-black font-bold text-white'>OR</p>
          <p className='text-[24px] px-2 py-2 text-black font-semibold text-white'>
            Already have an Account
          </p>
          <MyButton
            style={{
              minWidth: '300px',
              padding: '30px auto',
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
            }}
            onClick={() => navigate('/login')}
          >
            Log In
          </MyButton>
        </div>
      </div>
      <div className='w-[60%] py-3 px-2 md:py-6 md:px-3 flex items-center justify-center'>
        <div className='w-11/12 md:w-4/5 mx-auto'>
          <div className=''>
            <p className='text-[32px] px-2 text-black font-bold text-primary'>
              Sign Up For {isDoctorSignUp ? 'Doctor' : 'School'}
            </p>
          </div>
          <form className='w-full' onSubmit={handleSignUp}>
            <MyInput
              type='name'
              placeholder=''
              label={'Name'}
              required={true}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <MyInput
              type='email'
              placeholder=''
              label={'Email Address'}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <MyInput
              type='password'
              placeholder=''
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // isValid={false}
              // errorMessage='somthing went wrong'
              required={true}
              label={'Password'}
            />
            <MyInput
              type='password'
              placeholder=''
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              // isValid={false}
              // errorMessage='somthing went wrong'
              required={true}
              label={'Confirm Password'}
            />
            <div className=''>
              <input
                style={{ display: 'none' }}
                type='file'
                name=''
                id='file'
                onChange={handleUpladFile}
              />
              <label
                htmlFor='file'
                className='text-lg font-bold flex gap-3 items-center'
              >
                <div className=''>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 384 512'
                    width={'40px'}
                    height={'50px'}
                  >
                    <path d='M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z' />
                  </svg>
                </div>{' '}
                Upload Licence
              </label>
            </div>
            <div className='text-[white] flex justify-center py-6'>
              <MyButton
                style={{ minWidth: '300px', padding: '30px auto' }}
                type={'submit'}
              >
                {loading ? 'Loading...' : 'Sign Up'}{' '}
              </MyButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
