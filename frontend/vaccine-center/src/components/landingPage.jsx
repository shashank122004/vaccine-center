import React, { useState } from 'react';
import { Shield, Users, UserCog, Heart, Calendar, MapPin, Phone, Clock, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VaccinationLandingPage = () => {
  const [currentPage, setCurrentPage] = useState('landing');
 const navigate=useNavigate();

  if (currentPage === 'userLogin'){
    navigate("/user-login")
  }
  if (currentPage === 'adminLogin')navigate("/admin-login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  VaxCare Plus
                </h1>
                <p className="text-xs text-gray-500 font-medium">Healthcare Excellence</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Contact</a>
              <div className="flex items-center gap-2 text-blue-600">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">+1 (555) 123-VAXX</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-semibold mb-8 shadow-sm">
              <CheckCircle className="w-5 h-5" />
              Trusted by 50,000+ Patients
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight">
              Your Health,
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
                Our Priority
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience premium vaccination services with cutting-edge technology, 
              expert healthcare professionals, and personalized care at VaxCare Plus.
            </p>

            {/* Login Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={() => setCurrentPage('userLogin')}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 min-w-[250px]"
              >
                <Users className="w-7 h-7" />
                <span>Patient Portal</span>
                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-200"></div>
              </button>
              
              <button 
                onClick={() => setCurrentPage('adminLogin')}
                className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 min-w-[250px]"
              >
                <UserCog className="w-7 h-7" />
                <span>Staff Portal</span>
                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-200"></div>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Patients Served</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
              <div className="text-gray-600 font-medium">Safety Record</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="text-3xl font-bold text-indigo-600 mb-2">15+</div>
              <div className="text-gray-600 font-medium">Vaccine Types</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Comprehensive Vaccination Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From routine immunizations to specialized vaccines, we provide complete healthcare solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-200">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">Book your appointments online with our smart scheduling system. Choose your preferred time and vaccine type.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Expert Care</h3>
              <p className="text-gray-600 leading-relaxed">Our certified healthcare professionals ensure safe and comfortable vaccination experiences for all patients.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Digital Records</h3>
              <p className="text-gray-600 leading-relaxed">Access your complete vaccination history digitally. Get instant certificates and reminders for future doses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Operating Hours</h3>
              <p className="opacity-90">Mon-Fri: 8AM-8PM<br />Sat-Sun: 9AM-6PM</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Multiple Locations</h3>
              <p className="opacity-90">5 convenient centers<br />across the city</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">5-Star Rating</h3>
              <p className="opacity-90">Rated excellent by<br />98% of our patients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">VaxCare Plus</h3>
                <p className="text-gray-400 text-sm">Your trusted vaccination partner</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">© 2025 VaxCare Plus. All rights reserved.</p>
              <p className="text-sm text-gray-500">Licensed Healthcare Facility | Accredited by Health Authority</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VaccinationLandingPage;