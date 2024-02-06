import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useApi from '../hooks/useApi'
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Modal({ open, setOpen, uploadedImage, selectedImage, botId }) {
    const cancelButtonRef = useRef(null)
    const token = localStorage.getItem("token")
    const { data, loading, error, put } = useApi()

    const formData = new FormData();
    formData.append("BotId", botId)
    formData.append("BotEmoji", uploadedImage);
    const handleUploadImage = async () => {
        if (botId && selectedImage) {
            put("api/bot/createbot/", formData, {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "*/*",
                Authorization: `Bearer ${token}`
            })
        }
    }
    useEffect(()=>{
        if(data?.message){
                    }
    },[data])

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[#000] bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center w-full">
                                            <div className="w-[80px] h-[80px] rounded-2 mx-auto">
                                                {data?.message == "Avatar Updated!" ? <svg width="50" height="52" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_678_18281)">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 25.8303C0 18.9796 2.63392 12.4096 7.32233 7.56551C12.0107 2.72139 18.3696 0 25 0C31.6304 0 37.9893 2.72139 42.6777 7.56551C47.3661 12.4096 50 18.9796 50 25.8303C50 32.6809 47.3661 39.2509 42.6777 44.095C37.9893 48.9391 31.6304 51.6605 25 51.6605C18.3696 51.6605 12.0107 48.9391 7.32233 44.095C2.63392 39.2509 0 32.6809 0 25.8303H0ZM23.5733 36.8856L37.9667 18.2947L35.3667 16.1456L23.0933 31.9916L14.4 24.5077L12.2667 27.1528L23.5733 36.889V36.8856Z" fill="#295598" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_678_18281">
                                                            <rect width="50" height="51.6605" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                    : <img alt='img' src={selectedImage} className='w-full h-[100%] rounded-2 object-cover' style={{ maxWidth: '100%', maxHeight: '100px' }} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {data?.message == "Avatar Updated!" &&
                                        <div className="my-3 text-center w-full sm:ml-4 sm:mt-0 sm:text-left">
                                            <p className="text-base text-center font-semibold leading-6 text-gray-900">
                                                Your file was uploaded successfully
                                            </p>
                                        </div>
                                    }
                                </div>
                                {!data?.message &&
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={handleUploadImage}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                }
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
