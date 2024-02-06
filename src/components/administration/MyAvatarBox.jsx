import React, { useEffect, useState } from 'react'
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import {FaUser} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { useDataContext } from '../../context/DataContext';

const MyAvatarBox = ({ showoption, showbutton, data }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const {isDeleted,render} = useDataContext()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteBotId, setDeleteBotId] = useState()
    // console.log('deleteBotId: ', deleteBotId);
    const navigate = useNavigate()

    const handleEdit = (data) =>{
        navigate("/editavatar",{state:{data:data}})
    }

    const handleDelete = (id) =>{
        setDeleteBotId(id)
        setDeleteOpen(true)
    }
    useEffect(()=>{
        if(isDeleted == true){
            setDropdownOpen(false)
        }
    },[isDeleted,render])

    return (
        <>
        <DeleteModal deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} setDeleteBotId={setDeleteBotId} deleteBotId={deleteBotId} />
        <div className="relative w-[200px] h-[150px] bg-white m-2">
            {showoption &&
                <div className="absolute top-[10px] right-[10px]">
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
                        <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="1.51104" cy="1.51104" r="1.51104" fill="#494141" />
                            <circle cx="1.51104" cy="6.79961" r="1.51104" fill="#494141" />
                            <circle cx="1.51104" cy="12.0882" r="1.51104" fill="#494141" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-[10px] top-0 mt-2 bg-white rounded shadow-md p-2">
                            <div className="flex items-center">
                                <div className="w-full">
                                    <ul className="w-[90%] mx-auto">
                                        <li className="my-2 px-2">
                                            <button onClick={()=>handleEdit(data)} className="flex items-center">
                                                <div className="">
                                                    <MdEdit className="mr-2 w-[20px] h-[20px]" />
                                                </div>
                                                Edit
                                            </button>
                                        </li>
                                        <li className="my-2 px-2">
                                            <button onClick={()=>handleDelete(data?.BotId)} className="flex items-center">
                                                <div className="">
                                                    <MdDeleteOutline className="mr-2 w-[20px] h-[20px]" />
                                                </div>
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="fixed top-0 left-0 h-full w-full -z-[1]" onClick={() => setDropdownOpen(false)} />
                </div>
            }
            <div className='w-full h-[150px] bg-lightblue flex justify-center items-center rounded-[9px]' style={{ border: "0.5px dashed rgba(137, 137, 137, 0.70)" }}>
                <div className="text-center">
                    <div className="rounded-full w-[50px] h-[50px] flex justify-center items-center mx-auto">
                        {data?.emojiS3Link !== null ? (<img src={data?.emojiS3Link} className='w-full h-[100%] rounded-full object-cover' alt="" />)
                            :
                            (
                                data?.BotEmoji !== null ? <img src={data?.BotEmoji} className='w-full h-[100%] rounded-full object-cover' alt="" />
                                    :
                                    <div className="rounded-full flex items-center justify-center bg-primary w-[50px] h-[50px]">
                                        <FaUser className='text-white w-[80%] h-[80%] mx-auto rounded-full' />
                                    </div>
                            )
                        }
                    </div>
                    <div className="pt-2">
                        <p className='font-medium'>{data?.BotName}</p>
                        <p className='text-sm text-sm  h-[40px]'>{data?.BotDescription !== null || data?.BotDescription !== "" ? data?.BotDescription : " "}</p>
                        {showbutton &&
                            <button className='min-w-[100px] flex items-center justify-center mx-auto px-2 py-1 bg-primary text-sm text-white border border-primary hover:bg-white hover:text-primary rounded rounded-[3px] focus:outline-none transition-all duration-300 '>
                                {showbutton}
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default MyAvatarBox