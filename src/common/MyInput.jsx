import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const MyInput = ({
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    onBlur,
    width = 'w-full',
    bgColor = 'gray-500',
    isValid = true,
    errorMessage = '',
    label,
    required = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputClasses = `rounded-[3px] px-2 py-4 focus:outline-none w-full bg-[#f3f3f3]`;

    return (
        <>
            <div className={`${width} py-4`}>
                {label && (
                    <label htmlFor={props.id || props.name} className="text-black text-[18px] font-[600] ">
                        {label} {required && <span className="text-red">*</span>}
                    </label>
                )}
                <div className="relative pt-1">
                    <input
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={inputClasses}
                        required={required}
                        autoComplete='false'
                        autoFocus="false"
                        {...props}

                    />
                    {type === 'password' && (
                        <button
                            type="button"
                            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <HiEyeOff /> : <HiEye />}
                        </button>
                    )}
                </div>
                {!isValid && errorMessage && (
                    <p className="text-red text-sm mt-1">{errorMessage}</p>
                )}
            </div>
        </>
    );
};

export default MyInput;
