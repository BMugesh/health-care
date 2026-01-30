import { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Calendar, User, Edit2, Save, Camera } from 'lucide-react';
import { patientService } from '../services/api';

export default function PatientProfileModal({ isOpen, onClose, profileData, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Modal opened with profileData:', profileData);
    if (profileData) {
      // Map backend data to modal format
      // Handle photo from various possible fields
      const photoUrl = profileData.photoPreview || profileData.photo || profileData.photoUrl || null;

      setEditData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        dob: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profileData.gender || '',
        address: typeof profileData.address === 'string' ? profileData.address :
          `${profileData.address?.street || ''} ${profileData.address?.city || ''} ${profileData.address?.state || ''} ${profileData.address?.zipCode || ''}`.trim() || '',
        photoPreview: photoUrl,
      });
    }
  }, [profileData, isOpen]);

  if (!isOpen) return null;

  if (!editData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center">
          <p className="text-gray-600">No profile data available</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-primary text-gray-900 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          photo: file,
          photoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Update patient in backend
      const updateData = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone,
        dateOfBirth: editData.dob,
        gender: editData.gender,
        address: editData.address,
      };

      const response = await patientService.updatePatient(profileData._id || profileData.id, updateData);

      if (response.success) {
        alert('Profile updated successfully!');
        if (onUpdateProfile) {
          onUpdateProfile(response.data);
        }
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-900 hover:bg-black/10 rounded-lg p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Card Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Photo Section */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {editData?.photoPreview ? (
                  <img
                    src={editData.photoPreview}
                    alt={`${editData?.firstName || ''} ${editData?.lastName || ''}`.trim() || 'Patient'}
                    className="w-40 h-40 rounded-full object-cover border-4 border-primary-200"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-40 h-40 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 flex items-center justify-center border-4 border-primary-200 ${editData?.photoPreview ? 'hidden' : 'flex'}`}
                  style={{ display: editData?.photoPreview ? 'none' : 'flex' }}
                >
                  {editData?.firstName || editData?.lastName ? (
                    <span className="text-5xl font-bold text-gray-900">
                      {(editData?.firstName?.[0] || '').toUpperCase()}
                      {(editData?.lastName?.[0] || '').toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-20 h-20 text-gray-900" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mb-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-gray-900 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editData?.firstName || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold text-lg">{editData?.firstName || 'N/A'}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editData?.lastName || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold text-lg">{editData?.lastName || 'N/A'}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={editData?.dob || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                ) : (
                  <div>
                    <p className="text-gray-900 font-semibold">{formatDate(editData?.dob)}</p>
                    <p className="text-sm text-gray-500">Age: {calculateAge(editData?.dob)} years</p>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData?.gender || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-semibold capitalize">{editData?.gender || 'N/A'}</p>
                )}
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-600" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData?.email || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold break-all text-sm">{editData?.email || 'N/A'}</p>
                )}
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-600" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData?.phone || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{editData?.phone || 'N/A'}</p>
                )}
              </div>
            </div>

            {/* Address - Full Width */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editData?.address || ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                  rows="3"
                />
              ) : (
                <p className="text-gray-900 font-semibold whitespace-pre-wrap">{editData?.address || 'N/A'}</p>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-8 py-3 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
