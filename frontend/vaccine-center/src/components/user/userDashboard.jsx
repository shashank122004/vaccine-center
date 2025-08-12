import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios.js"

import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  User, 
  Shield, 
  Bell, 
  ChevronRight,
  Plus,
  History,
  Stethoscope,
  Building2,
  Phone,
  Mail,
  LogOut
} from 'lucide-react';

const UserDashboard = () => {
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [pincode, setPincode] = useState('');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [user, setUser] = useState(null);

  // New state variables for the details modal
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate=useNavigate();

  const userinfo= JSON.parse(localStorage.getItem("user"));

  const getcurrentappointment = async () => {
    try {
      const response = await api.get("user/get-appointments");
      const formattedAppointments = response.data.data.map(curappointmentdata => ({
        _id: curappointmentdata._id,
        vaccine: curappointmentdata.vaccine.name,
        center: curappointmentdata.center.name,
        address: curappointmentdata.center.address,
        date: curappointmentdata.slot.date.split('T')[0],
        time: curappointmentdata.slot.timeSlot,
        status: curappointmentdata.status
      }));
      setCurrentAppointments(formattedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };
  
  const appointmenthistory = async () => {
    try {
      const response = await api.get("/user/appointments-history");
      const history = response.data.data;
      const formattedHistory = history.map(item => ({
        id: item._id,
        vaccine: item.vaccine.name,
        center: item.center.name,
        date: item.slot.date.split('T')[0],
        time: item.slot.timeSlot,
        status: item.status
      }));
      setAppointmentHistory(formattedHistory);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };
  
  // This is the updated function to fetch and display details
  const viewDetails = async (appointmentId) => {
    try {
      const res = await api.get(`/user/view-appointments?appointmentId=${appointmentId}`);
      // Set the received data and open the modal
      setViewingAppointment(res.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch appointment details:", error);
      // Use an alert as a fallback, but a modal would be better here too
      alert("Failed to fetch appointment details. Please try again.");
    }
  };

  useEffect(() => {
    const mockUser = {
      name: userinfo.fullname,
      phone: userinfo.contact,
      email: userinfo.email,
      age: 21,
      bloodGroup: 'O+'
    };
    setUser(mockUser);
    
    getcurrentappointment();
    appointmenthistory();
  }, []);

  const handlePincodeSearch = async () => {
    if (!pincode || pincode.length < 5) {
      alert('Please enter a valid pincode');
      return;
    }

    setSearchLoading(true);
    try {
        const response= await api.get(`/user/find-center-by-pincode?pincode=${pincode}`);
        const centers= response.data.data;
        setCenters(centers);
    } catch (error) {
        alert('Could not fetch centers. Please try again later.');
    } finally {
        setSearchLoading(false);
    }
  };

  const handleCenterSelect = (center) => {
    console.log('Selected center:', center);
    navigate("/center-select");
  };

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out successfully');
    navigate("/user-login");
  };

  const handleKeyDown =(e)=>{
    if(e.key==="Enter") {
      handlePincodeSearch();
    }
  }; 
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const res = await api.patch(`/user/cancel-appointment?appointmentId=${appointmentId}`);
      if (res.data) {
        alert("appointment cancelled");
        getcurrentappointment();
        appointmenthistory();
      }
    } catch (error) {
       alert("appointment do not exist");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  VaxCare Plus
                </h1>
                <p className="text-sm text-gray-500">Patient Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800">{user?.name}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">Manage your vaccinations and stay protected</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Appointment */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Current Appointment</h3>
              </div>
              
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <div key={appointment._id} className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200 mb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {appointment.vaccine}
                        </h4>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{appointment.center}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{appointment.address}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-blue-200">
                      {/* View Details button now works */}
                      <button 
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => viewDetails(appointment._id)}
                      >
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                          onClick={() => cancelAppointment(appointment._id)}
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                      onClick={() => navigate("/center-select")}
                  >
                    Book New Appointment
                  </button>
                </div> 
              )}
            </div>

            {/* Appointment History */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <History className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Appointment History</h3>
              </div>

              <div className="space-y-4">
                {appointmentHistory.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800">{appointment.vaccine}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{appointment.center}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-all duration-200"
                        onClick={() => viewDetails(appointment.id)}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Search Centers */}
          <div className="space-y-8">
            {/* User Info Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                <p className="text-gray-500">Adhar ID: {userinfo.adhar_number}</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{user?.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Stethoscope className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Age: {user?.age}, Blood: {user?.bloodGroup}</span>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-white/20 backdrop-blur-sm py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
                 onClick={() => navigate("/center-select")}

                >
                  <Plus className="w-5 h-5" />
                  <span>Book New Appointment</span>
                </button>
                <button className="w-full bg-white/20 backdrop-blur-sm py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2">
                  <History className="w-5 h-5" />
                  <span>Download Records</span>
                </button>
              </div>
            </div>
            {/* quick action closes here */}
            
            {/* Pincode Search */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-2xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Find Centers</h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-12"
                    maxLength={6}
                    onKeyDown={handleKeyDown}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <button
                  onClick={handlePincodeSearch}
                  disabled={searchLoading || !pincode}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {searchLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search Centers</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Centers Results */}
              {centers.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-gray-800 mb-4">Available Centers ({centers.length})</h4>
                  {centers.map((center) => (
                    <div 
                      key={center.id}
                      onClick={() => handleCenterSelect(center)}
                      className="p-4 bg-gray-50 rounded-2xl hover:shadow-md hover:bg-white border-2 border-transparent hover:border-purple-200 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-gray-800">{center.name}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(center.availability)}`}>
                          {center.availability}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{center.address}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-gray-700">{center.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment Details Modal */}
      {isModalOpen && viewingAppointment && (
        <div className="fixed inset-0 bg-none bg-opacity-2 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Appointment Details</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-500">Vaccine</p>
                <p className="font-medium">{viewingAppointment.vaccine.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Center</p>
                <p className="font-medium">{viewingAppointment.center.name}</p>
                <p className="text-sm text-gray-500">{viewingAppointment.center.address}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Date & Time</p>
                <p className="font-medium">{new Date(viewingAppointment.slot.date).toLocaleDateString()} at {viewingAppointment.slot.timeSlot}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(viewingAppointment.status)}`}>
                  {viewingAppointment.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Booked On</p>
                <p className="font-medium">{new Date(viewingAppointment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
