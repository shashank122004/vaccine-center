// src/components/userpages/userLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { Users } from "lucide-react";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUserLogin = async () => {
    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/user-dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert("Login failed: " + (error.response?.data?.message || "Check credentials"));
    }
  };
 const handleKeyDown= (e)=>{
    if(e.key==="Enter")
      handleUserLogin();
 }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform animate-in fade-in duration-500 border border-blue-100">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>  
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Patient Login</h2>
          <p className="text-gray-600">Access your vaccination records and book appointments</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={handleUserLogin}
          >
            Sign In to Your Account
          </button>

          <div className="text-center">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Forgot your password?
            </a>
          </div>

          {/* Added: Back to Home and Register buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => navigate("/")}
              className="w-full border border-blue-500 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => navigate("/user/register")}
              className="w-full border border-green-500 text-green-600 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-200"
            >
              Register as New User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
