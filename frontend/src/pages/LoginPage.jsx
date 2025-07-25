import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL
    : "/api"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                email,
                password
            }, {withCredentials: true})

            if(res.status === 200)
                navigate("/")

        } catch (error) {
            console.error("Login error: ", error)
            toast.error("Invalid email or password")
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-700'>
        <form
            onSubmit={handleLogin}
            className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'
        >
            <h2 className='text-2xl font-bold mb-6 text-center'>
                Login
            </h2>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>
                    Email
                </label>
                <input
                    type="email"
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
                Login
            </button>

            <p className="text-sm text-gray-600 mt-4 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                    Sign Up
                </Link>
            </p>

        </form>
    </div>
  )
}

export default LoginPage