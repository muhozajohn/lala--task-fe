import React from 'react';
import { User, Mail, Camera, Edit2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';


const Profile = () => {
  // Function to get user data from the token in localStorage
  const getUserData = () => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in localStorage');
      return {
        avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        email: '',
        name: '',
        
      };
    }

    try {
      // Decode the token
      const decoded = jwtDecode(token);

      // Extract user data from the decoded token
      return {
        avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        email: decoded.email || '',
        name: decoded.name || '',
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {
        avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        email: '',
        name: '',
        
      };
    }
  };

  const user = getUserData();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                <Camera size={18} />
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">@{user.name}</p>
            </div>

            {/* Edit Profile Button */}
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>

          {/* Contact Information */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-800">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="text-gray-700">Change Password</span>
              <Edit2 size={16} className="text-gray-400" />
            </button>
            <button className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="text-gray-700">Notification Settings</span>
              <Edit2 size={16} className="text-gray-400" />
            </button>
            <button className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span className="text-gray-700">Privacy Settings</span>
              <Edit2 size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;