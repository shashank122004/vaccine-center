import React from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, Building, Syringe, CheckCircle, Download, ArrowLeft, Printer } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const FinalConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract the real booking data from the location state
  const { confirmedBookingData } = location.state || {};

  // ✅ Get user info from localStorage
  const userString = localStorage.getItem("user");
  const userinfo = userString ? JSON.parse(userString) : {};

  // Handle case where user navigates directly without state
  if (!confirmedBookingData) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">No Booking Data Found</h1>
        <p className="mt-4">Please go back to the booking page to confirm an appointment.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg">
          Go to Home
        </button>
      </div>
    );
  }

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadConfirmation = () => {
    // Logic to download confirmation as PDF
    console.log("Downloading confirmation...");
  };

  const handlePrintConfirmation = () => {
    // Logic to print confirmation
    window.print();
  };

  const handleGoBack = () => {
    navigate("/user-dashboard");
  };

  const handleBookAnother = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Appointment Confirmed!</h1>
          <p className="text-lg text-gray-600">Your vaccination appointment has been successfully booked</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Booking ID: {confirmedBookingData._id}
          </div>
        </div>

        {/* Main Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">

          {/* Patient Information Section */}
         <div className="mb-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
    <User className="w-6 h-6 mr-3 text-blue-600" />
    Patient Information
  </h2>

  {/* Responsive two-column layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Column 1 */}
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium">Full Name:</span>
        <span className="font-semibold text-gray-900">{userinfo.fullname}</span>
      </div>

      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium">Phone Number:</span>
        <span className="font-semibold text-gray-900 flex items-center">
          <Phone className="w-4 h-4 mr-2 text-blue-600" />
          {userinfo.contact}
        </span>
      </div>

      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium">Email Address:</span>
        <span className="font-semibold text-gray-900 flex items-center">
          <Mail className="w-4 h-4 mr-2 text-blue-600" />
          {userinfo.email}
        </span>
      </div>
    </div>

    {/* Column 2 */}
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium">Aadhar Number:</span>
        <span className="font-semibold text-gray-900">{userinfo.adhar_number}</span>
      </div>
    </div>
  </div>
</div>


          {/* Vaccine Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Syringe className="w-6 h-6 mr-3 text-green-600" />
              Vaccine Details
            </h2>
            <div className="bg-green-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-700 font-medium">Vaccine Name:</span>
                    <span className="font-bold text-green-900">{confirmedBookingData.vaccine?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-700 font-medium">Manufacturer:</span>
                    <span className="font-semibold text-green-900">{confirmedBookingData.vaccine?.manufacturer}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Slot Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Calendar className="w-6 h-6 mr-3 text-purple-600" />
              Appointment Slot
            </h2>
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-purple-700 font-medium">Date:</span>
                    <span className="font-bold text-purple-900">
                      {formatDate(confirmedBookingData.slot?.date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-purple-700 font-medium">Time:</span>
                    <span className="font-bold text-purple-900 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {confirmedBookingData.slot?.timeSlot}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination Center Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Building className="w-6 h-6 mr-3 text-orange-600" />
              Vaccination Center Details
            </h2>
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-orange-900 mb-2">{confirmedBookingData.center?.name}</h3>
                <div className="flex items-start text-orange-800 mb-2">
                  <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{confirmedBookingData.center?.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <CheckCircle className="w-6 h-6 mr-3 text-blue-600" />
              Booking Information
            </h2>
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Booking Date:</span>
                    <span className="font-semibold text-blue-900">
                      {new Date(confirmedBookingData.createdAt).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Status:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {confirmedBookingData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Guidelines */}
          <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-400">
            <h3 className="text-lg font-bold text-yellow-900 mb-4">Important Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-yellow-800 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Arrive 15 minutes before your scheduled time
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Bring valid ID proof (Aadhar card preferred)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Carry previous vaccination certificates
                </li>
              </ul>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Wear a mask and maintain social distancing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Stay for 15-30 minutes post-vaccination
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Inform about any allergies or medical conditions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleDownloadConfirmation}
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Confirmation
          </button>

          <button
            onClick={handlePrintConfirmation}
            className="flex items-center px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Confirmation
          </button>

          <button
            onClick={handleBookAnother}
            className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book Another Appointment
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Keep this confirmation safe. You may need to show it at the vaccination center.</p>
          <p className="mt-1">For any queries, contact the vaccination center directly.</p>
        </div>
      </div>
    </div>
  );
};

export default FinalConfirmationPage;