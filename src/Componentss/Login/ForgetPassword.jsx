import React from 'react'
import { auth } from '../firebase/Firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const ForgetPassword = () => {
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const emailVal = e.target.email.value;
        
        try {
            await sendPasswordResetEmail(auth, emailVal)
            alert("Check your email for a password reset link.")
            // navigate("/") 
        } catch (err) {
            alert(`Error: ${err.code}`)
        }
    }

    return (
        <div className='forget'>
            <h1>Forget Password</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name='email' required /><br /><br />
                <button type="submit">Reset</button>
            </form>
        </div>
    )
}

export default ForgetPassword
