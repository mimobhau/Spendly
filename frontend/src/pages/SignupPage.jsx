import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {useNavigate, Link} from "react-router-dom"

const SignupPage = () => {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                fullName,
                email,
                password
            }, {withCredentials: true})

            if(res.status === 201 || res.status === 200){
                toast.success("Account created successfully")
                navigate("/")
            }
            
        } catch (error) {
            console.error("Signup error: ", error)
            toast.error(error.response?.data?.message || "Signup failed")
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-700'>
        <form
            onSubmit={handleSignup}
            className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'
        >
            <h2 className='text-2xl font-bold mb-6 text-center'>
                Sign Up
            </h2>

            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>
                    Full Name
                </label>
                <input
                    type="text"
                    placeholder='Full Name'
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
            </div>

            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>
                    Email
                </label>
                <input
                    type="text"
                    placeholder='Email'
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

             <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>
                    Password
                </label>
                <input
                    type="password"
                    placeholder='Password'
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button
                type='submit'
                className='w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-md hover:from-green-600 hover:to-green-800'
            >
                Sign Up
            </button>

            <p className="text-sm text-gray-600 mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>

        </form>
    </div>
  )
}

export default SignupPage