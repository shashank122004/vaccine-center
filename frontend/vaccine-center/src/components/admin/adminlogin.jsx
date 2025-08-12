import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
import api from "../../api/axios.js";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [adminid, setAdminid] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdminLogin = async () => {
    setErrorMessage(""); // clear previous error
    console.log("Login button clicked");

    try {
      const res = await api.post("/admin/login", {
        adminId: adminid,
        password: password,
      });

      const { accessToken, refreshToken, user } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("admin", JSON.stringify(user));

      alert("Admin login successful!");
      navigate("/admin-dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.errors ;
      setErrorMessage(msg);
      console.error("Admin login failed:", msg);
    }
  };

  // Submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdminLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-purple-100">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <UserCog className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Portal</h2>
          <p className="text-gray-600">Secure access for healthcare professionals</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Staff ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white"
              placeholder="Enter your staff ID"
              value={adminid}
              onChange={(e) => setAdminid(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02] transition-all shadow-lg"
            onClick={()=>handleAdminLogin()}
          >
            Access Staff Portal
          </button>

          {/* Show error message */}
          {errorMessage && (
            <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-8 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 mx-auto"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
