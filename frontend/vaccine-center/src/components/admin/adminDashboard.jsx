import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Calendar, 
  Plus, 
  Syringe, 
  Clock, 
  CheckCircle, 
  X, 
  LogOut,
  User,
  Star,
  Activity,
  TrendingUp,
  AlertCircle,
  Check,
  Ban,
  Edit
} from 'lucide-react';
import api from "../../api/axios.js" 


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [centerInfo, setCenterInfo] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Slot creation form state
  const [slotForm, setSlotForm] = useState({
    date: '',
    time: '',
    maxAppointments: 20
  });

  // Mock data - replace with actual API calls
  const center_data=JSON.parse(localStorage.getItem("admin"));

  const setvaccine_list = async () => {
    try {
      const res = await api.get("/admin/vaccine-list");
      const vaccines = res.data.data; // This is an array of vaccine objects

      // Check if vaccines is a valid array
      if (Array.isArray(vaccines)) {
        const formattedVaccines = vaccines.map(vaccine => ({
          id: vaccine._id,
          name: vaccine.name,
          manufacturer: vaccine.manufacturer,
          price: vaccine.price
        }));
        setAvailableVaccines(formattedVaccines);
      } else {
        // Handle cases where the data is not in the expected array format
        console.error("API response data is not an array:", vaccines);
      }
    } catch (error) {
      console.error("Error fetching vaccine list:", error);
    }
  };
  
  const setAppointmentlist = async () => {
    try {
        const res = await api.get("/admin/get-appointments");
        const appointments = res.data.data;

        if (Array.isArray(appointments)) {
            const formattedAppointments = appointments.map(appointment => ({
                id: appointment._id,
                // FIX: Accessing fullname from the correct path
                patientName: appointment.userId.fullname,
                vaccine: appointment.vaccine.name,
                date: appointment.slot.date, 
                time: appointment.slot.timeSlot,
                status: appointment.status,
            }));
            setRegisteredPatients(formattedAppointments);
        } else {
            console.error("API response data is not an array:", appointments);
            showToast('Problem with appointment data format', 'error');
        }
    } catch (error) {
        console.error("Error fetching appointments:", error);
        showToast('Problem fetching appointment list', 'error'); 
    }
};


  useEffect(() => {
    // Mock center info
    setCenterInfo({
      id: center_data._id,
      name: center_data.name,
      address: center_data.address,
      phone: center_data.contactNumber,
      email: center_data.adminemail,
      rating: 4.9,
      totalAppointments: 1247,
      todayAppointments: 45,
      completedToday: 38,
      scheduledToday: 7 // Changed from pendingToday
    });

    // Mock admin info
    setAdminInfo({
      name: center_data.name,
      email: center_data.adminUsername,
      role: 'Center Administrator',
      phone: center_data.contactNumber
    });

      // Mock available vaccines
    setvaccine_list();

    setAppointmentlist();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleVaccineToggle = (vaccine) => {
    setSelectedVaccines(prev => {
      const isSelected = prev.find(v => v.id === vaccine.id);
      if (isSelected) {
        return prev.filter(v => v.id !== vaccine.id);
      } else {
        return [...prev, vaccine];
      }
    });
  };

  const handleAddVaccines = async () => {
    if (selectedVaccines.length === 0) {
      showToast('Please select at least one vaccine', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await api.post("/admin/addvaccinetocenter",{
        vaccineIds: selectedVaccines
      })
      setTimeout(() => {
        showToast(`Successfully added ${selectedVaccines.length} vaccines to center`, 'success');
        setSelectedVaccines([]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      showToast('Failed to add vaccines', 'error');
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!slotForm.date || !slotForm.time) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await api.post("/admin/createslot",{
        timeSlot:slotForm.time, capacity:slotForm.maxAppointments
      })
      setTimeout(() => {
        showToast('Slot created successfully', 'success');
        setSlotForm({ date: '', time: '', maxAppointments: 20 });
        setLoading(false);
      }, 1500);
    } catch (error) {
      showToast('Failed to create slot', 'error');
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    setLoading(true);
    try {
      // FIX 1: Construct the URL with query parameters
      const url = `/admin/update-appo-status?appointmentId=${appointmentId}&status=${newStatus}`;
      
      // FIX 2: Await the actual API call and remove the setTimeout
      await api.patch(url);
      
      // Update the state only after a successful API response
      setRegisteredPatients(prev => 
        prev.map(patient => 
          patient.id === appointmentId 
            ? { ...patient, status: newStatus }
            : patient
        )
      );
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      
    } catch (error) {
      console.error("API error updating status:", error);
      showToast('Failed to update status', 'error');
    } finally {
      // This will run whether the API call succeeds or fails
      setLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    showToast('Logged out successfully', 'success');
    // Redirect to admin login
    setTimeout(() => {
      window.location.href = '/admin-login';
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <Clock className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        } animate-in slide-in-from-right duration-300`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  VaxCare Plus
                </h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 text-sm">{adminInfo?.name}</p>
                  <p className="text-xs text-gray-500">{adminInfo?.role}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 bg-white rounded-2xl p-2 shadow-sm border border-purple-100">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'vaccines', label: 'Add Vaccines', icon: Syringe },
              { id: 'slots', label: 'Create Slots', icon: Calendar },
              { id: 'patients', label: 'View Patients', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Center Info & Admin Info */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Center Info */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-2xl">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Center Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{centerInfo?.name}</h4>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{centerInfo?.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{centerInfo?.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{centerInfo?.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-gray-800">{centerInfo?.rating}</span>
                    <span className="text-gray-500">• {centerInfo?.totalAppointments} total appointments</span>
                  </div>
                </div>
              </div>

              {/* Admin Info */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-2xl">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Administrator</h3>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">{adminInfo?.name}</h4>
                    <p className="text-purple-600 font-medium">{adminInfo?.role}</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{adminInfo?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{adminInfo?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{centerInfo?.todayAppointments}</p>
                    <p className="text-gray-600 text-sm">Today's Appointments</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{centerInfo?.completedToday}</p>
                    <p className="text-gray-600 text-sm">Completed Today</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{centerInfo?.scheduledToday}</p>
                    <p className="text-gray-600 text-sm">Scheduled Today</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{centerInfo?.totalAppointments}</p>
                    <p className="text-gray-600 text-sm">Total Served</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Vaccines Tab */}
        {activeTab === 'vaccines' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-2xl">
                  <Syringe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Add Vaccines to Center</h3>
              </div>
              
              {selectedVaccines.length > 0 && (
                <button
                  onClick={handleAddVaccines}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add {selectedVaccines.length} Vaccines
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableVaccines.map((vaccine) => {
                const isSelected = selectedVaccines.find(v => v.id === vaccine.id);
                return (
                  <div
                    key={vaccine.id}
                    onClick={() => handleVaccineToggle(vaccine)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{vaccine.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{vaccine.manufacturer}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-green-600">{vaccine.price}</span>
                          {/* <span className="text-gray-500">Stock: {vaccine.inStock}</span> */}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedVaccines.length > 0 && (
              <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-4">Selected Vaccines ({selectedVaccines.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVaccines.map((vaccine) => (
                    <div key={vaccine.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-purple-200">
                      <span className="text-sm font-medium">{vaccine.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVaccineToggle(vaccine);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Slots Tab */}
        {activeTab === 'slots' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-purple-100 p-3 rounded-2xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Create Time Slots</h3>
            </div>

            <div className="max-w-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter today's Date *</label>
                  <input
                    type="date"
                    value={slotForm.date}
                    onChange={(e) => setSlotForm({...slotForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time *</label>
                  <input
                    type="time"
                    value={slotForm.time}
                    onChange={(e) => setSlotForm({...slotForm, time: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Appointments</label>
                  <input
                    type="number"
                    value={slotForm.maxAppointments}
                    onChange={(e) => setSlotForm({...slotForm, maxAppointments: parseInt(e.target.value)})}
                    min="1"
                    max="100"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 mt-1">Default: 20 appointments per slot</p>
                </div>
              </div>

              <button
                onClick={handleCreateSlot}
                disabled={loading || !slotForm.date || !slotForm.time}
                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Slot...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Time Slot
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* View Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-purple-100 p-3 rounded-2xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Registered Patients</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Patient</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Vaccine</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-800">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-800">{patient.vaccine}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-800">{patient.date}</p>
                          <p className="text-sm text-gray-500">{patient.time}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(patient.status)}`}>
                          {getStatusIcon(patient.status)}
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {patient.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(patient.id, 'Completed')}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Complete
                              </button>
                              <button
                                onClick={() => handleStatusChange(patient.id, 'Cancelled')}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3" />
                                Cancel
                              </button>
                            </>
                          )}
                          {patient.status !== 'Scheduled' && (
                            <button
                              onClick={() => handleStatusChange(patient.id, 'Scheduled')}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {registeredPatients.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No registered patients found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
