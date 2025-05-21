import React, { useContext } from 'react';
import { createContext, useEffect, useState } from "react"
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth, useUser } from "@clerk/clerk-react";


export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const { user, isLoaded } = useUser();

    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({

        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)

    const [companyData, setCompanyData] = useState(null)

    const [userData,setUserData] = useState(null)

    const [userApplications,setUserApplications] = useState(null)

    //Function to fetch jobs 
    const fetchJobs = async () => {
       try {
          
        const {data} = await axios.get(backendUrl + '/api/jobs')


        if(data.success){
            setJobs(data.jobs)
            console.log(data.jobs);
        }else{
            toast.error(data.message)
        }
        
       } catch (error) {
          toast.error(error.message)
        
       }
        
    }

    //Function to fetch company Data

    const fetchCompanyData = async (token = companyToken) => {


        try {

           const { data } = await axios.get(`${backendUrl}/api/company/company`, {
    headers: { Authorization: `Bearer ${token}` },
});



            if (data.success) {

                setCompanyData(data.company)
                console.log(data);
                
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }

        
    };

    //Function to fetch user data
   const fetchUserData = async () => {
    try {
        const token = await getToken();
        console.log("Clerk Auth Token:", token); 

        const {data} = await axios.get(backendUrl + '/api/users/user', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
            setUserData(data.user);
        } else {
            console.log("User fetch failed:", data.message); // ✅ Add this
            toast.error(data.message);
        }
        
    } catch (error) {
        console.error("User fetch error:", error); // ✅ Improve this
        toast.error(error.message);
    }
}

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken');

        if (storedCompanyToken){
            setCompanyToken(storedCompanyToken);
            fetchCompanyData(storedCompanyToken);
        }
    },[])

    useEffect(() =>{
        if (companyToken) {
            fetchCompanyData() 
        }

    },[companyToken])

    useEffect(() => {
  if (isLoaded && user) {
    fetchUserData();
  }
}, [isLoaded, user]);

    

    const value = {

        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData,setCompanyData,
        backendUrl,
        userData,setUserData,
        userApplications, setUserApplications

    }

    return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}