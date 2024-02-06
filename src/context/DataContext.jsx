
import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
    return useContext(DataContext);
};

export const DataContextProvider = ({ children }) => {
    const [studentData, setStudentData] = useState(null);
    const [refresh,setRefresh] = useState(false)
    return (
        <DataContext.Provider value={{ studentData, setStudentData,refresh,setRefresh }}>
            {children}
        </DataContext.Provider>
    );
};
