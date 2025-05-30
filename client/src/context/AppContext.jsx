import React, { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user, isLoaded } = useUser();

  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);

  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);

  const [userApplications, setUserApplications] = useState(null);

  //Function to fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");

      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Function to fetch company Data

  const fetchCompanyData = async (token = companyToken) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If user exists in DB
      if (res.data.success) {
        setUserData(res.data.user);
      } else {
        // Try to create user if not found
        console.log("User not found in DB, attempting to create user...");
        const createRes = await axios.post(
          `${backendUrl}/api/users`,
          {
            email: user.primaryEmailAddress.emailAddress,
            name: user.fullName,
            clerkId: user.id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (createRes.data.success) {
          setUserData(createRes.data.user);
          toast.success("User profile created");
        } else {
          toast.error(createRes.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching/creating user:", error);
      toast.error(error.message);
    }
  };

  //Function to fetch user's applied applications data
  const fetchUserApplications = async() => {
    try {

      const token = await getToken()

      const {data} = await axios.get(backendUrl+'/api/users/applications',
        {headers: {Authorization: `Bearer ${token}`}}
      )

      if (data.success) {

        setUserApplications(data.applications)
        
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
      fetchCompanyData(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [isLoaded, user]);

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
