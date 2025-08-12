import React, { useState } from 'react';
import { User, Shield, Mail, Phone, Calendar, Droplets, Lock, Eye, EyeOff, Heart, Users, Award, CheckCircle } from 'lucide-react';
import api from "../../api/axios.js"
import { useNavigate } from 'react-router-dom';
const UserRegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    adhar_number: '',
    contact: '',
    email: '',
    password: '',
    bloodgroup: '',
    dob: '',
    age: 0
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
const navigate=useNavigate()
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const [day, month, year] = dob.split('/').map(Number);
    if (!day || !month || !year) return 0;
    
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleInputChange = (field, value) => {
    if (field === 'dob') {
      // Format DOB input (dd/mm/yyyy)
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
      }
      if (formattedValue.length >= 5) {
        formattedValue = formattedValue.substring(0, 5) + '/' + formattedValue.substring(5, 9);
      }
      value = formattedValue;
      
      // Calculate age
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [field]: value,
        age: calculatedAge
      }));
    } else if (field === 'adhar_number') {
      // Format Aadhar number (xxxx xxxx xxxx)
      let formattedValue = value.replace(/\D/g, '');
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length <= 14) {
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
      }
    } else if (field === 'contact') {
      // Only allow numbers for contact
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!formData.adhar_number.replace(/\s/g, '') || formData.adhar_number.replace(/\s/g, '').length !== 12) {
      newErrors.adhar_number = 'Valid 12-digit Aadhar number is required';
    }
    if (!formData.contact || formData.contact.length !== 10) {
      newErrors.contact = 'Valid 10-digit contact number is required';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.bloodgroup) newErrors.bloodgroup = 'Blood group is required';
    if (!formData.dob || formData.age < 1) {
      newErrors.dob = 'Valid date of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Prepare data for JSON submission
    const jsonData = {
      fullname: formData.fullname.trim(),
      adhar_number: formData.adhar_number.replace(/\s/g, ''),
      contact: formData.contact,
      email: formData.email.toLowerCase(),
      password: formData.password,
      bloodgroup: formData.bloodgroup,
      age: formData.age
    };
    
    try {
      // Simulate API call
      const response=await api.post("/user/register",jsonData)
      console.log('Registration data (JSON):', jsonData);
      alert('Registration successful! Welcome to VaccineCare+');
      navigate("/user-login")
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Attractive UI */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-800/90"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-16 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-bounce delay-1000"></div>
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-16 text-center">
          <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              VaccineCare+
            </h1>
            <p className="text-xl text-blue-100 font-light">
              Your Health, Our Priority
            </p>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 gap-8 mb-12">
            <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
              <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-300" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Comprehensive Care</h3>
                <p className="text-blue-100 text-sm">Complete vaccination management system</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Trusted Platform</h3>
                <p className="text-blue-100 text-sm">Secure and reliable health services</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
              <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Expert Network</h3>
                <p className="text-blue-100 text-sm">Access to certified healthcare providers</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-200 text-sm">Happy Users</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-200 text-sm">Centers</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-200 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join our healthcare community today</p>
          </div>
          
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
                    errors.fullname ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
            </div>
            
            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhar Number *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.adhar_number}
                  onChange={(e) => handleInputChange('adhar_number', e.target.value)}
                  placeholder="1234 5678 9012"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
                    errors.adhar_number ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.adhar_number && <p className="text-red-500 text-xs mt-1">{errors.adhar_number}</p>}
            </div>
            
            {/* Contact & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
                      errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter secure password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            {/* Blood Group & DOB Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Group *
                </label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.bloodgroup}
                    onChange={(e) => handleInputChange('bloodgroup', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 appearance-none ${
                      errors.bloodgroup ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                {errors.bloodgroup && <p className="text-red-500 text-xs mt-1">{errors.bloodgroup}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth * {formData.age > 0 && <span className="text-blue-600 font-normal">(Age: {formData.age})</span>}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 ${
                      errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Create Account
                </div>
              )}
            </button>
            
            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account? 
                <button className="text-blue-600 hover:text-blue-700 font-semibold ml-1 hover:underline transition-colors"
                    onClick={()=>{navigate("/user-login")}}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default UserRegistrationPage;