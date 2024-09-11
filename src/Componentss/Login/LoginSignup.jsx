import React, { useState } from 'react';
import { useFormik } from 'formik';
import { FaUser,FaEnvelope, FaLock } from 'react-icons/fa';
import { Button, Input } from 'antd';
import './auth.css';
import { loginValidationSchema, signupValidationSchema } from './validationSchema';
import { auth } from '../firebase/Firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
    const [isLoginActive, setIsLoginActive] = useState(false);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsLoginActive(!isLoginActive);
    };

    const loginFormik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginValidationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                await signInWithEmailAndPassword(auth, values.email, values.password);
                console.log('Login successful');
                resetForm(); 
                navigate("/success");
            } catch (error) {
                console.error('Error signing in:', error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const signupFormik = useFormik({
        initialValues: { username: '', email: '', password: '', confirmPassword: '' },
        validationSchema: signupValidationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            if (values.password !== values.confirmPassword) {
                console.error('Passwords do not match');
                return;
            }
            try {
                await createUserWithEmailAndPassword(auth, values.email, values.password);
                console.log('Sign up successful');
                resetForm();
                navigate("/success");
            } catch (error) {
                console.error('Error signing up:', error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleReset = () => {
        navigate("/forget")
    }

    return (
        <div className="parent">
            <div className="container cont">
                <div className="form-section">
                    <div className={`form-wrapper ${isLoginActive ? 'active' : 'inactive'}`}>
                        {isLoginActive ? (
                            <form className="form login-form" onSubmit={loginFormik.handleSubmit}>
                                <h2 className="title">Login</h2>
                                <div className="input-field">
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={loginFormik.values.email}
                                        onChange={loginFormik.handleChange}
                                        onBlur={loginFormik.handleBlur}
                                        prefix={<FaEnvelope className="input-icon" />}
                                    />
                                    {loginFormik.touched.email && loginFormik.errors.email && (
                                        <div className="error">{loginFormik.errors.email}</div>
                                    )}
                                </div>
                                <div className="input-field">
                                    <Input.Password
                                        name="password"
                                        placeholder="Password"
                                        value={loginFormik.values.password}
                                        onChange={loginFormik.handleChange}
                                        onBlur={loginFormik.handleBlur}
                                        prefix={<FaLock className="input-icon" />}
                                    />
                                    {loginFormik.touched.password && loginFormik.errors.password && (
                                        <div className="error">{loginFormik.errors.password}</div>
                                    )}
                                </div>
                                <button type="submit" className="login-btn buton" disabled={loginFormik.isSubmitting}>
                                    Login
                                </button>
                                <p id='forgetPassword' onClick={handleReset}>Forget Password ?</p>
                            </form>
                        ) : (
                            <div className="background-text">
                                <h2>Welcome Back!</h2>
                                <p>Login to access your account.</p>
                            </div>
                        )}
                    </div>

                    <div className={`form-wrapper ${!isLoginActive ? 'active' : 'inactive'}`}>
                        {!isLoginActive ? (
                            <form className="form signup-form" onSubmit={signupFormik.handleSubmit}>
                                <h2 className="title">Sign Up</h2>
                                <div className="input-field">
                                    <Input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={signupFormik.values.username}
                                        onChange={signupFormik.handleChange}
                                        onBlur={signupFormik.handleBlur}
                                        prefix={<FaUser className="input-icon" />}
                                    />
                                    {signupFormik.touched.username && signupFormik.errors.username && (
                                        <div className="error">{signupFormik.errors.username}</div>
                                    )}
                                </div>
                                <div className="input-field">
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={signupFormik.values.email}
                                        onChange={signupFormik.handleChange}
                                        onBlur={signupFormik.handleBlur}
                                        prefix={<FaEnvelope className="input-icon" />}
                                    />
                                    {signupFormik.touched.email && signupFormik.errors.email && (
                                        <div className="error">{signupFormik.errors.email}</div>
                                    )}
                                </div>
                                <div className="input-field">
                                    <Input.Password
                                        name="password"
                                        placeholder="Password"
                                        value={signupFormik.values.password}
                                        onChange={signupFormik.handleChange}
                                        onBlur={signupFormik.handleBlur}
                                        prefix={<FaLock className="input-icon" />}
                                    />
                                    {signupFormik.touched.password && signupFormik.errors.password && (
                                        <div className="error">{signupFormik.errors.password}</div>
                                    )}
                                </div>
                                <div className="input-field">
                                    <Input.Password
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={signupFormik.values.confirmPassword}
                                        onChange={signupFormik.handleChange}
                                        onBlur={signupFormik.handleBlur}
                                        prefix={<FaLock className="input-icon" />}
                                    />
                                    {signupFormik.touched.confirmPassword && signupFormik.errors.confirmPassword && (
                                        <div className="error">{signupFormik.errors.confirmPassword}</div>
                                    )}
                                </div>
                                <button type="submit" className="sign-btn buton" disabled={signupFormik.isSubmitting}>
                                    Sign Up
                                </button>
                            </form>
                        ) : (
                            <div className="background-text">
                                <h2>Join Us!</h2>
                                <p>Sign up to create a new account.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="toggle-section">
                    <button className="toggle-btn" onClick={handleToggle}>
                        {isLoginActive ? 'Switch to Sign Up' : 'Switch to Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
