import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, CheckCircle, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginCredentials, SignUpCredentials } from '../../types/auth';

const Login: React.FC = () => {
  const { login, signUp, isLoading, error, clearError, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Toggle between login and signup
  const [isSignUp, setIsSignUp] = useState(false);

  // Login state - REVERTED: back to email to match backend
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    email: '', // Changed back to email
    password: '',
    rememberMe: false,
  });

  // SignUp state
  const [signUpCredentials, setSignUpCredentials] = useState<SignUpCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [isSignUp, clearError]);

  // Validation functions
  const validateLoginForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!loginCredentials.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginCredentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginCredentials.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!signUpCredentials.name.trim()) {
      errors.name = 'Full name is required';
    } else if (signUpCredentials.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!signUpCredentials.name.trim().includes(' ')) {
      errors.name = 'Please enter both first and last name';
    }

    if (!signUpCredentials.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpCredentials.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!signUpCredentials.password) {
      errors.password = 'Password is required';
    } else if (signUpCredentials.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signUpCredentials.password)) {
      errors.password = 'Password must contain at least one uppercase, lowercase, and number';
    }

    if (!signUpCredentials.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signUpCredentials.password !== signUpCredentials.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!signUpCredentials.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateLoginForm()) return;

    try {
      console.log('Starting login process...');
      await login(loginCredentials);
      console.log('Login successful, navigating to dashboard...');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateSignUpForm()) return;

    try {
      console.log('Starting signup process with data:', {
        name: signUpCredentials.name,
        email: signUpCredentials.email,
        password: '[hidden]',
        confirmPassword: '[hidden]',
        acceptTerms: signUpCredentials.acceptTerms
      });
      
      await signUp(signUpCredentials);
      console.log('Signup successful, navigating to dashboard...');
      navigate('/');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  // Input change handlers
  const handleLoginInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setLoginCredentials(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    clearError();
  };

  const handleSignUpInputChange = (field: keyof SignUpCredentials, value: string | boolean) => {
    setSignUpCredentials(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    clearError();
  };

  // Google OAuth integration using react-oauth/google
  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google OAuth successful, token received');
        await loginWithGoogle(tokenResponse.access_token);
        console.log('Google login successful, navigating to dashboard...');
        navigate('/');
      } catch (error) {
        console.error('Google auth failed:', error);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
    }
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(signUpCredentials.password);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-background"
      >
        <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-5">
          {/* Logo and Title */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E49B0F] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">UNI360</span>
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 px-2">
              {isSignUp 
                ? 'Join students on their journey to Germany' 
                : 'Sign in to continue your Study in Germany journey'
              }
            </p>
          </div>

          {/* Google Auth Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="truncate">
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
              </span>
            </button>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-500 dark:text-gray-400">Or</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2 text-red-700 dark:text-red-400"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Forms */}
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              // Login Form - REVERTED: back to email
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLoginSubmit}
                className="space-y-2 sm:space-y-3"
              >
                {/* Email - REVERTED from Username */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginCredentials.email}
                      onChange={(e) => handleLoginInputChange('email', e.target.value)}
                      disabled={isLoading}
                      className={`pl-10 h-11 sm:h-12 w-full rounded-xl border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginCredentials.password}
                      onChange={(e) => handleLoginInputChange('password', e.target.value)}
                      disabled={isLoading}
                      className={`pl-10 pr-10 h-11 sm:h-12 w-full rounded-xl border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm">{validationErrors.password}</p>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={loginCredentials.rememberMe}
                      onChange={(e) => handleLoginInputChange('rememberMe', e.target.checked)}
                      disabled={isLoading}
                      className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 disabled:opacity-50"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-500">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 bg-[#E49B0F] hover:bg-[#D97706] text-white font-semibold rounded-xl shadow-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Sign Up Link for Login Form */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                    className="text-orange-600 hover:text-orange-500 font-medium disabled:opacity-50"
                  >
                    Sign up
                  </button>
                </motion.p>
              </motion.form>
            ) : (
              // Sign Up Form remains the same
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignUpSubmit}
                className="space-y-3 sm:space-y-4"
              >
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpCredentials.name}
                      onChange={(e) => handleSignUpInputChange('name', e.target.value)}
                      disabled={isLoading}
                      className={`pl-10 h-11 sm:h-12 w-full rounded-xl border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpCredentials.email}
                      onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                      disabled={isLoading}
                      className={`pl-10 h-11 sm:h-12 w-full rounded-xl border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={signUpCredentials.password}
                      onChange={(e) => handleSignUpInputChange('password', e.target.value)}
                      disabled={isLoading}
                      className={`pl-10 pr-10 h-11 sm:h-12 w-full rounded-xl border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {signUpCredentials.password && (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-0.5 flex-1 rounded ${
                              i < passwordStrength
                                ? passwordStrength <= 2
                                  ? 'bg-red-500'
                                  : passwordStrength <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'} password
                      </p>
                    </div>
                  )}

                  {validationErrors.password && (
                    <p className="text-red-500 text-sm">{validationErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signUpCredentials.confirmPassword}
                      onChange={(e) => handleSignUpInputChange('confirmPassword', e.target.value)}
                      disabled={isLoading}
                      className={`pl-10 pr-10 h-11 sm:h-12 w-full rounded-xl border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {signUpCredentials.confirmPassword && (
                    <div className="mt-1 flex items-center gap-1.5">
                      {signUpCredentials.password === signUpCredentials.confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-green-600 dark:text-green-400">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          <span className="text-xs text-red-600 dark:text-red-400">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}

                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={signUpCredentials.acceptTerms}
                      onChange={(e) => handleSignUpInputChange('acceptTerms', e.target.checked)}
                      className={`mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded flex-shrink-0 disabled:opacity-50 ${
                        validationErrors.acceptTerms ? 'border-red-300 dark:border-red-600' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                      I agree to the{' '}
                      <Link to="/terms" className="text-orange-600 hover:text-orange-500">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-orange-600 hover:text-orange-500">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {validationErrors.acceptTerms && (
                    <p className="text-red-500 text-sm">{validationErrors.acceptTerms}</p>
                  )}
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 bg-[#E49B0F] hover:bg-[#D97706] text-white font-semibold rounded-xl shadow-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Sign In Link for Sign Up Form */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    disabled={isLoading}
                    className="text-orange-600 hover:text-orange-500 font-medium disabled:opacity-50"
                  >
                    Sign in
                  </button>
                </motion.p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Section - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 bg-[#C4DFF0] dark:from-gray-900 dark:to-gray-800 items-center justify-center p-8 xl:p-12"
      >
        <div className="max-w-sm xl:max-w-md text-center">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            src="/student-hero.jpg"
            alt="Student studying abroad"
            className="w-full h-auto rounded-2xl shadow-2xl mb-6 xl:mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl xl:text-2xl font-bold text-gray-800 dark:text-white mb-3 xl:mb-4"
          >
            Your Gateway to Global Education
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm xl:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Join thousands of students who have successfully started their study abroad journey with UNI360.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;