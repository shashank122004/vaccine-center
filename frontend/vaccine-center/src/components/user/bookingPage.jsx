import React, { useState,useEffect} from 'react';
import { Search, MapPin, Building, Clock, Users, IndianRupee, Calendar, CheckCircle, AlertCircle, Loader, Star, Award } from 'lucide-react';
import api from "../../api/axios.js"
import { useNavigate } from 'react-router-dom';

// Mock API functions - replace with actual API calls
const mockSearchCentersByPincode = async (pincode) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (pincode === '560001') {
    return [
      {
        id: 1,
        name: "City Hospital Vaccination Center",
        address: "123 Main Street, Downtown, Bangalore",
        distance: "2.5 km",
        rating: 4.8,
        totalSlots: 45,
        availableSlots: 23
      },
      {
        id: 2,
        name: "Community Health Center",
        address: "456 Oak Avenue, Midtown, Bangalore",
        distance: "3.2 km",
        rating: 4.5,
        totalSlots: 32,
        availableSlots: 18
      },
      {
        id: 3,
        name: "Metro Medical Complex",
        address: "789 Pine Road, Uptown, Bangalore",
        distance: "4.1 km",
        rating: 4.9,
        totalSlots: 60,
        availableSlots: 35
      }
    ];
  }
  return [];
};

const mockGetCenterDetails = async (centerId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const centerData = {
    1: {
      vaccines: [
        { id: 1, name: "COVID-19 Pfizer", price: 500, manufacturer: "Pfizer-BioNTech", available: true, description: "mRNA vaccine", doses: "2 doses required" },
        { id: 2, name: "COVID-19 Moderna", price: 450, manufacturer: "Moderna", available: true, description: "mRNA vaccine", doses: "2 doses required" },
        { id: 3, name: "Influenza Vaccine", price: 300, manufacturer: "GSK", available: false, description: "Seasonal flu vaccine", doses: "Annual dose" },
        { id: 4, name: "Hepatitis B", price: 350, manufacturer: "Bharat Biotech", available: true, description: "Hepatitis B prevention", doses: "3 doses required" }
      ],
      slots: [
        { id: 1, time: "09:00 AM", capacity: 10, booked: 8, date: "2025-08-07", type: "morning" },
        { id: 2, time: "10:00 AM", capacity: 10, booked: 5, date: "2025-08-07", type: "morning" },
        { id: 3, time: "11:00 AM", capacity: 10, booked: 10, date: "2025-08-07", type: "morning" },
        { id: 4, time: "02:00 PM", capacity: 15, booked: 3, date: "2025-08-07", type: "afternoon" },
        { id: 5, time: "03:00 PM", capacity: 15, booked: 12, date: "2025-08-07", type: "afternoon" },
        { id: 6, time: "04:00 PM", capacity: 10, booked: 7, date: "2025-08-07", type: "afternoon" }
      ]
    },
    2: {
      vaccines: [
        { id: 5, name: "COVID-19 Covishield", price: 250, manufacturer: "AstraZeneca", available: true, description: "Viral vector vaccine", doses: "2 doses required" },
        { id: 6, name: "Typhoid Vaccine", price: 200, manufacturer: "Sanofi", available: true, description: "Typhoid prevention", doses: "Single dose" },
        { id: 7, name: "MMR Vaccine", price: 400, manufacturer: "Serum Institute", available: true, description: "Measles, Mumps, Rubella", doses: "2 doses required" }
      ],
      slots: [
        { id: 7, time: "10:00 AM", capacity: 12, booked: 4, date: "2025-08-07", type: "morning" },
        { id: 8, time: "11:30 AM", capacity: 12, booked: 12, date: "2025-08-07", type: "morning" },
        { id: 9, time: "01:00 PM", capacity: 8, booked: 6, date: "2025-08-07", type: "afternoon" },
        { id: 10, time: "02:30 PM", capacity: 8, booked: 2, date: "2025-08-07", type: "afternoon" }
      ]
    },
    3: {
      vaccines: [
        { id: 8, name: "COVID-19 Novavax", price: 550, manufacturer: "Novavax", available: true, description: "Protein subunit vaccine", doses: "2 doses required" },
        { id: 9, name: "Japanese Encephalitis", price: 450, manufacturer: "Valneva", available: true, description: "JE prevention", doses: "2 doses required" },
        { id: 10, name: "Yellow Fever", price: 380, manufacturer: "Sanofi Pasteur", available: false, description: "Yellow fever prevention", doses: "Single dose" }
      ],
      slots: [
        { id: 11, time: "09:30 AM", capacity: 15, booked: 3, date: "2025-08-07", type: "morning" },
        { id: 12, time: "11:00 AM", capacity: 15, booked: 8, date: "2025-08-07", type: "morning" },
        { id: 13, time: "01:30 PM", capacity: 20, booked: 5, date: "2025-08-07", type: "afternoon" },
        { id: 14, time: "03:30 PM", capacity: 20, booked: 15, date: "2025-08-07", type: "afternoon" }
      ]
    }
  };
  
  return centerData[centerId] || { vaccines: [], slots: [] };
};

const AppointmentBookingSystem = () => {
  const [pincode, setPincode] = useState('');
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingCenterDetails, setLoadingCenterDetails] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate=useNavigate();
  const handlePincodeSearch = async () => {
    if (!pincode || pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    setLoadingCenters(true);
    setSearchPerformed(true);
    setCenters([]);
    setSelectedCenter(null);
    setVaccines([]);
    setSlots([]);
    setSelectedVaccine(null);
    setSelectedSlot(null);

    try {
      const response= await api.get(`/user/find-center-by-pincode?pincode=${pincode}`);
      const centersData= response.data.data;
      setCenters(centersData);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleCenterSelect = async (center) => {
    setSelectedCenter(center);
    setLoadingCenterDetails(true);
    setVaccines([]);
    setSlots([]);
    setSelectedVaccine(null);
    setSelectedSlot(null);

    try {
      const response = await api.get(`/user/get-vaccine-slot-details?centerId=${center._id}`);
      
      // ✅ Corrected: Access the 'data' property of the response
      const { vaccines, slots } = response.data.data;
      setVaccines(vaccines);
      setSlots(slots);

    } catch (error) {
      console.error('Error fetching center details:', error);
    } finally {
      setLoadingCenterDetails(false);
    }
  };

  // The 'handleVaccineSelect' function has been updated to remove the 'if (vaccine.available)' check.
  // This allows any vaccine to be selected, regardless of its 'available' status.
  const handleVaccineSelect = async (vaccine) => {
      setSelectedVaccine(selectedVaccine?.id === vaccine.id ? null : vaccine);
  };

  const handleSlotSelect = async (slot) => {
    if (slot.booked < slot.capacity) {
      setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
    }
  };

  const getSlotStatus = (slot) => {
    const available = slot.capacity - slot.booked;
    const percentage = (slot.booked / slot.capacity) * 100;
    
    if (percentage >= 100) return { status: 'full', color: 'bg-gradient-to-r from-red-100 to-red-200 border-red-300 text-red-800' };
    if (percentage >= 80) return { status: 'limited', color: 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800' };
    return { status: 'available', color: 'bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800' };
  };

  const totalAmount = selectedVaccine ? selectedVaccine.price : 0;

  const handleConfirmBooking = async () => {
    if (selectedCenter && selectedVaccine && selectedSlot) {
      // ✅ CORRECTED: Build the bookingData object with only the string IDs
      const bookingData = {
        centerId: selectedCenter._id,
        slotId: selectedSlot.id, 
        vaccineId: selectedVaccine.id
      };
      
      try {
          const response = await api.post("/user/book-appointment", bookingData);
          
          if (response.status === 200 || response.status === 201) {
            console.log('Booking confirmed:', response.data);
            alert('Booking confirmed! Redirecting to confirmation page...');
            const confirmedBookingData = response.data.data; 

            // ✅ CRITICAL CHANGE: Pass the data to the confirmation page via the state object
            navigate("/user-confirm-page", {
              state: { confirmedBookingData }
            });
          } else {
            console.error('Booking failed with status:', response.status);
            alert('Booking failed. Please try again.',response.status);
          }
      } catch (error) {
        const msg = error.response?.data?.errors || "Something went wrong.";
        alert(msg);
        }
    }
};

const handlekeydown=(e)=>{
  if(e.key==="Enter")
    handlePincodeSearch();
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Book Your Vaccination
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find nearby vaccination centers and book your appointment with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Enhanced Search & Center Selection */}
          <div className="space-y-6">
            {/* Enhanced Pincode Search */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <Search className="w-5 h-5 text-white" />
                </div>
                Search by Pincode
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode (try 560001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"            
                  onKeyDown={handlekeydown}
                />
                <button
                  onClick={handlePincodeSearch}
                  disabled={loadingCenters}
                  className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loadingCenters ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Centers List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Building className="w-5 h-5 text-white" />
                </div>
                Available Centers
              </h2>
              
              {!searchPerformed ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Enter pincode to discover centers</p>
                </div>
              ) : loadingCenters ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Finding vaccination centers...</p>
                </div>
              ) : centers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <p className="text-gray-500 text-lg">No centers found for pincode {pincode}</p>
                  <p className="text-gray-400 mt-1">Try a different pincode</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {centers.map((center, index) => (
                    <div
                      key={center.id}
                      onClick={() => handleCenterSelect(center)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        selectedCenter?.id === center.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                      }`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">{center.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs font-medium text-yellow-700">{center.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        {center.address}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium text-sm">
                          Distance: {center.distance}
                        </span>
                        <div className="flex items-center text-green-600 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {center.availableSlots}/{center.totalSlots} slots
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Enhanced Vaccines & Slots */}
          <div className="space-y-6">
            {!selectedCenter ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-16 h-16 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Center</h3>
                <p className="text-gray-500 text-lg">Choose a vaccination center to view available vaccines and slots</p>
              </div>
            ) : (
              <>
                {/* Enhanced Selected Center Info */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{selectedCenter.name}</h3>
                      <p className="text-blue-100 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedCenter.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 rounded-lg px-3 py-1 mb-2">
                        <span className="text-sm font-medium">Distance</span>
                        <div className="font-bold">{selectedCenter.distance}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {loadingCenterDetails ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading vaccines and slots...</p>
                  </div>
                ) : (
                  <>
                    {/* Enhanced Vaccines Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        Available Vaccines
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vaccines.map((vaccine, index) => (
                          <div
                            key={vaccine.id}
                            onClick={() => handleVaccineSelect(vaccine)}
                            // The className logic has been simplified to remove the unavailable check
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                selectedVaccine?.id === vaccine.id
                                ? 'border-green-500 bg-gradient-to-r from-green-50 to-teal-50 shadow-lg'
                                : 'border-gray-200 hover:border-green-300 hover:shadow-lg bg-white'
                            }`}
                            style={{
                              animationDelay: `${index * 0.1}s`,
                              animation: 'fadeInUp 0.5s ease-out forwards'
                            }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">{vaccine.name}</h3>
                                <p className="text-xs text-gray-600">{vaccine.manufacturer}</p>
                              </div>
                             {selectedVaccine?.id === vaccine.id && (
                               <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-3">{vaccine.description}</p>
                            <div className="text-xs text-blue-600 mb-3">{vaccine.doses}</div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-green-600">
                                <IndianRupee className="w-5 h-5" />
                                <span className="font-bold text-lg">{vaccine.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Slots Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
      <Clock className="w-5 h-5 text-white" />
    </div>
    Available Time Slots
  </h2>
  <span>All slots valid for 2 hours only</span>
  {/* Consolidated Slot Display */}
  <div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {/* Map directly over the full slots array without filtering */}
      {slots.map((slot, index) => {
        const slotInfo = getSlotStatus(slot);
        const available = slot.capacity - slot.booked;
        
        return (
          <div
            key={slot.id}
            onClick={() => handleSlotSelect(slot)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              slot.booked >= slot.capacity
                ? 'cursor-not-allowed opacity-60'
                : selectedSlot?.id === slot.id
                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                : 'hover:border-purple-300 hover:shadow-md'
            } ${slotInfo.color}`}
            style={{
              animationDelay: `${index * 0.05}s`,
              animation: 'fadeInUp 0.3s ease-out forwards'
            }}
          >
            <div className="text-center">
              <div className="font-bold text-sm mb-1">{slot.time}</div>
              <div className="text-xs mb-2 text-gray-600">
                {new Date(slot.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center justify-center text-xs mb-1">
                <Users className="w-3 h-3 mr-1" />
                <span className="font-medium">{available}/{slot.capacity}</span>
              </div>
              <div className="text-xs font-medium">
                {slotInfo.status === 'full' && '🔴 Full'}
                {slotInfo.status === 'limited' && '🟡 Limited'}
                {slotInfo.status === 'available' && '🟢 Available'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
                    {/* Enhanced Booking Summary */}
                    {(selectedVaccine || selectedSlot) && (
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white transform transition-all duration-500">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                          <CheckCircle className="w-8 h-8 mr-3" />
                          Booking Summary
                        </h3>
                        
                        {selectedVaccine && (
                          <div className="mb-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Selected Vaccine:</span>
                              <span className="font-bold">{selectedVaccine.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Price:</span>
                              <span className="font-bold flex items-center text-xl">
                                <IndianRupee className="w-5 h-5" />
                                {selectedVaccine.price}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {selectedSlot && (
                          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Selected Slot:</span>
                              <span className="font-bold">{selectedSlot.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Date:</span>
                              <span className="font-bold">
                                {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="border-t border-white/30 pt-6">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-bold">Total Amount:</span>
                            <span className="text-3xl font-bold flex items-center bg-white/20 rounded-lg px-4 py-2">
                              <IndianRupee className="w-7 h-7" />
                              {totalAmount}
                            </span>
                          </div>
                          
                          <button
                            onClick={handleConfirmBooking}
                            disabled={!selectedVaccine || !selectedSlot}
                            className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                              selectedVaccine && selectedSlot
                                ? 'bg-white text-indigo-600 hover:bg-gray-100 hover:scale-105 shadow-xl hover:shadow-2xl'
                                : 'bg-white/30 text-white/70 cursor-not-allowed'
                            }`}
                          >
                            {!selectedVaccine && !selectedSlot
                              ? '✨ Select vaccine and slot to continue'
                              : !selectedVaccine
                              ? '💉 Select a vaccine to continue'
                              : !selectedSlot
                              ? '⏰ Select a time slot to continue'
                              : '🎉 Confirm Booking'
                            }
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingSystem;
