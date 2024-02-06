import React from 'react';

const MyButton = ({ type,rightArrow, children, ...props }) => {
  let bgColorClasses = 'bg-primary text-white border-primary hover:bg-transparent hover:text-primary';
  if (type === 'transparent') {
    bgColorClasses = 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white';
  } else if (type === 'secondary') {
    bgColorClasses = 'bg-darkblue text-white border-darkblue hover:bg-transparent hover:text-darkblue';
  }

  return (
    <button
      className={`px-4 py-2 flex items-center justify-center mx-auto text-[18px] border rounded focus:outline-none transition-all min-w-[200px] duration-300 rounded-[3px] ${bgColorClasses} `}
      {...props}
    >
      {children}
      {rightArrow &&
        <div className="px-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.0607 13.0607C23.6464 12.4749 23.6464 11.5251 23.0607 10.9393L13.5147 1.3934C12.9289 0.807611 11.9792 0.807611 11.3934 1.3934C10.8076 1.97919 10.8076 2.92893 11.3934 3.51472L19.8787 12L11.3934 20.4853C10.8076 21.0711 10.8076 22.0208 11.3934 22.6066C11.9792 23.1924 12.9289 23.1924 13.5147 22.6066L23.0607 13.0607ZM0 13.5H22V10.5H0V13.5Z" fill="white" />
          </svg>
        </div>
      }
    </button>
  );
};

export default MyButton;
