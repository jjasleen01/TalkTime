import React, { useContext } from "react";
import assets from "../assets/assets.js";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const LoginPage = ()=>{
    const [currState, setCurrState] = useState("Sign Up");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setisDataSubmitted] = useState(false); //user initially on first page 
    const {login} = useContext(AuthContext);

    const onSubmitHandler = (event)=>{
        event.preventDefault();
        if(currState === "Sign Up" && !isDataSubmitted){
            setisDataSubmitted(true); //take user to next page (add bio)
            return;
        }
        login(currState=== "Sign Up" ? "signup" : "login", {fullName, email, password, bio})
    }
    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

        {/* left */}
        <img src={assets.logo_icon} alt="" className="w-[min(30vw,250px)]"/>

        {/* right */}
        <form onSubmit = {onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
            
            <h2 className="font-medium text-2xl flex justify-between items-center"> {currState}  {/*~ SignUp/Login */}
                {isDataSubmitted && <img onClick = {()=> setisDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer"/> } 
                {/* data submitted = true (bio page) ~ show arrow to come back to signup page */}
                
            </h2>

            {/* sign up - showing extra full name*/}
            {
            currState === "Sign Up" && !isDataSubmitted && (
            <input onChange={(event)=> setFullName(event.target.value)} type="text" placeholder="Full Name" className="p-2 border border-gray-500 rounded-md focus:outline-none" value = {fullName} required/>)
            }

           {/* login + signup */}
           {
            !isDataSubmitted && (
                <>
                <input onChange={(event)=> setEmail(event.target.value)} type ="email" placeholder="Email Address" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value = {email} required/>

                <input onChange={(event)=> setPassword(event.target.value)} type ="password" placeholder="Password" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value = {password} required/>
                </>
            )}
            
            {/* Bio textarea isDataSubmitted ~ true */}
            {
                currState === "Sign Up" && isDataSubmitted && (
                    <textarea onChange={(event)=> setBio(event.target.value)} rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Provide a short bio..." value = {bio} required></textarea>
                )
            }

            {/* create account/ login BUTTON */}
            <button className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer" type="submit">{currState === "Sign Up"? "Create Account" : "Login"}</button>
           
           {/* terms and conditions */}
           <div className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox"/>
                <p>Agree to the terms of use and privacy policy</p> 
           </div>

           <div className="flex flex-col gap-2">
                {
                    currState === "Sign Up" ? 
                    (
                        <p className="text-sm text-gray-600">Already have an account? &nbsp; <span onClick = {()=>{setCurrState("Login");setisDataSubmitted(false);}} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
                    ):
                    (
                        <p className="text-sm text-gray-600">Create an account &nbsp;<span onClick={()=>{setCurrState("Sign Up");}} className="font-medium text-violet-500 cursor-pointer" >Click here</span></p>
                    )
                }
           </div>
        </form>
        </div>
    )

}
export default LoginPage
