"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setLoggedInUser } from "@/lib/storage";
import { User } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<null | "login" | "signup">(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;
    return passwordRegex.test(password);
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    // Real-time validation hints
    const newFieldErrors = { ...fieldErrors };
    if (name === "email" && value.trim()) {
      if (!validateEmail(value)) {
        newFieldErrors.email = "Email must end with @gmail.com";
      } else {
        newFieldErrors.email = "";
      }
    } else if (name === "password" && value.trim()) {
      if (!validatePassword(value)) {
        newFieldErrors.password = "Minimum 6 characters and one special character";
      } else {
        newFieldErrors.password = "";
      }
    }
    setFieldErrors(newFieldErrors);
  };

  // Helper function to check if backend is running
  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Helper function to get user-friendly error message
  const getErrorMessage = (error: any, apiUrl: string): string => {
    // Network/CORS errors
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        return '❌ Server is not running. Make sure backend is started on http://localhost:5000';
      }
      if (error.message.includes('CORS')) {
        return '❌ CORS error - Backend CORS configuration issue';
      }
      if (error.message.includes('Connection refused')) {
        return '❌ Cannot connect to server. Is it running on port 5000?';
      }
      return `❌ Network error: ${error.message}`;
    }

    // Invalid API endpoint
    if (error.status === 404) {
      return `❌ Invalid API endpoint: ${apiUrl}`;
    }

    // Validation/Business logic errors
    if (error.status === 400) {
      return error.message || '❌ Invalid input data';
    }

    // Conflict errors (username/email exists)
    if (error.status === 409) {
      return error.message || '❌ Username or email already exists';
    }

    // Server errors
    if (error.status === 500) {
      return `❌ Server error: ${error.message || 'Something went wrong on the server'}`;
    }

    return '❌ Unknown error. Please check console for details';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const newFieldErrors = { username: "", email: "", password: "" };

    // Validation
    let isValid = true;

    if (!formData.username.trim()) {
      newFieldErrors.username = "Username is required";
      setError("Please fill in all required fields");
      isValid = false;
    } else if (mode === "signup") {
      // Check if username exists only during signup
      const usernameExists = await checkUsernameExists(formData.username);
      if (usernameExists) {
        newFieldErrors.username = "Username already exists";
        setError("Username already exists. Please choose a different one");
        isValid = false;
      }
    }

    if (!formData.email.trim()) {
      newFieldErrors.email = "Email is required";
      setError("Please fill in all required fields");
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newFieldErrors.email = "Email must end with @gmail.com";
      setError("Email must end with @gmail.com");
      isValid = false;
    }

    if (!formData.password.trim()) {
      newFieldErrors.password = "Password is required";
      setError("Please fill in all required fields");
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newFieldErrors.password = "Minimum 6 characters and one special character";
      setError("Password must be at least 6 characters and contain one special character");
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      // Determine which endpoint and whether to use login or register
      const isLoginMode = mode === "login";
      const apiUrl = isLoginMode 
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

      const requestBody = isLoginMode
        ? {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      console.log(`🔄 Calling ${isLoginMode ? 'LOGIN' : 'REGISTER'}: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

      // Parse response
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        setError(`❌ Invalid response from server. Status: ${response.status}`);
        setLoading(false);
        return;
      }

      // Handle non-200 responses
      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || 'Unknown error';
        console.error(`❌ ${isLoginMode ? 'Login' : 'Registration'} failed:`, responseData);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Success!
      console.log(`✅ ${isLoginMode ? 'Login' : 'Registration'} successful`);

      // Show success message based on mode
      if (isLoginMode) {
        setError(""); // Clear error
        // Store user with doctorVerified status
        const user: User = {
          username: responseData.user.username,
          email: responseData.user.email,
          password: formData.password,
          doctorVerified: responseData.user.doctorVerified ?? true,
        };
        setLoggedInUser(user);
        
        // Show success and redirect
        setTimeout(() => {
          router.push("/annotate");
        }, 500);
      } else {
        // Signup success
        setError(""); // Clear error
        // Store user
        const user: User = {
          username: responseData.user.username,
          email: responseData.user.email,
          password: formData.password,
          doctorVerified: responseData.user.doctorVerified ?? true,
        };
        setLoggedInUser(user);
        
        // Show success and redirect
        setTimeout(() => {
          router.push("/annotate");
        }, 500);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      
      // Determine if backend is running
      const backendHealthy = await checkBackendHealth();
      
      if (!backendHealthy) {
        setError(
          '❌ Cannot reach backend server. ' +
          'Make sure:\n1. Backend is running (npm run dev in /backend)\n2. Port 5000 is correct\n3. MongoDB is running'
        );
      } else {
        setError(
          getErrorMessage(err, 'http://localhost:5000/api/auth/' + (mode === "login" ? 'login' : 'register'))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMode(null);
    setFormData({ username: "", email: "", password: "" });
    setError("");
    setFieldErrors({ username: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#D6F0FF]">
      {/* Left Panel - Branding */}
      <div
        className={`w-1/2 bg-[#D6F0FF] hidden md:flex flex-col items-center justify-center text-center p-10 transition-all duration-700 ease-in-out ${
          mode ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-6">DoctorAnnotate</h1>
        <p className="text-lg text-gray-700 px-6 py-3 bg-white/40 rounded-lg max-w-xs">
          Where doctors annotate medical images.
        </p>
      </div>

      {/* Right Panel - Auth Forms */}
      <div
        className={`flex flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out bg-[#D6F0FF] ${
          mode ? "w-full" : "w-full md:w-1/2"
        }`}
      >
        {/* Mobile Title */}
        {!mode && (
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">DoctorAnnotate</h1>
            <p className="text-gray-600 mt-2 text-sm">Where doctors annotate medical images.</p>
          </div>
        )}

        {/* Welcome Screen */}
        {!mode && (
          <div className="text-center space-y-6 w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
            <p className="text-lg text-gray-600">Choose an option to continue</p>

            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => setMode("login")}
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium px-8 py-3 rounded-lg transition shadow-md border border-gray-200"
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium px-8 py-3 rounded-lg transition shadow-md border border-gray-200"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="login-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6F0FF] focus:border-transparent"
                  placeholder="your username"
                />
                {fieldErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6F0FF] focus:border-transparent"
                  placeholder="your.email@gmail.com"
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
                {!fieldErrors.email && formData.email === "" && (
                  <p className="text-gray-500 text-sm mt-1">Only Gmail addresses allowed</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6F0FF] focus:border-transparent"
                  placeholder="Enter password"
                />
                {!fieldErrors.password && formData.password === "" && (
                  <p className="text-gray-500 text-sm mt-1">Minimum 6 characters and one special character</p>
                )}
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#D6F0FF] hover:bg-[#C6E8FA] text-gray-800 font-medium rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline font-medium"
              >
                Create one
              </button>
            </p>

            <button
              onClick={handleReset}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Signup Form */}
        {mode === "signup" && (
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6F0FF] focus:border-transparent"
                  placeholder="choose username"
                />
                {fieldErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6F0FF] focus:border-transparent"
                  placeholder="your.email@gmail.com"
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
                {!fieldErrors.email && formData.email === "" && (
                  <p className="text-gray-500 text-sm mt-1">Only Gmail addresses allowed</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6F0FF] focus:border-transparent"
                  placeholder="Create password"
                />
                {!fieldErrors.password && formData.password === "" && (
                  <p className="text-gray-500 text-sm mt-1">Minimum 6 characters and one special character</p>
                )}
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#D6F0FF] hover:bg-[#C6E8FA] text-gray-800 font-medium rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>

            <button
              onClick={handleReset}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
