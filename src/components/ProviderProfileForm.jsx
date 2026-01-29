import { useState } from 'react';
import { User, Briefcase, Award, Building2, FileText, Camera, ArrowRight, Heart } from 'lucide-react';
import { providerService } from '../services/api';

export default function ProviderProfileForm({ userData, onComplete, onNavigate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        specialization: '',
        licenseNumber: '',
        yearsOfExperience: '',
        hospitalAffiliation: '',
        bio: '',
        photo: null,
        photoPreview: null,
    });

    const specializations = [
        'Cardiology',
        'Dermatology',
        'Emergency Medicine',
        'Family Medicine',
        'General Practice',
        'Geriatrics',
        'Internal Medicine',
        'Neurology',
        'Oncology',
        'Pediatrics',
        'Psychiatry',
        'Surgery',
        'Other',
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    photo: file,
                    photoPreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const profileData = {
                specialization: formData.specialization,
                licenseNumber: formData.licenseNumber,
                yearsOfExperience: parseInt(formData.yearsOfExperience),
                hospitalAffiliation: formData.hospitalAffiliation,
                bio: formData.bio,
            };

            console.log('📤 Submitting provider profile:', profileData);

            // Call API to update provider profile
            const response = await providerService.updateProviderProfile(userData.id, profileData);

            console.log('✅ Provider profile updated:', response);

            if (response.success) {
                alert('Profile completed successfully! Welcome to HealthPulse.');
                onComplete({
                    ...userData,
                    ...profileData,
                    photoPreview: formData.photoPreview,
                });
            }
        } catch (err) {
            console.error('❌ Profile completion error:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to complete profile. Please try again.';
            setError(`Profile completion failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Heart className="w-7 h-7 text-white" fill="white" />
                        </div>
                        <span className="text-3xl font-bold text-white">HealthPulse</span>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Complete Your Professional Profile
                    </h2>
                    <p className="text-primary-100 text-lg leading-relaxed">
                        Help us understand your expertise so we can provide the best experience for you and your patients.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-white mb-1">500+</div>
                        <div className="text-primary-100 text-sm">Healthcare Providers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-white mb-1">10K+</div>
                        <div className="text-primary-100 text-sm">Patients Monitored</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                        <div className="text-primary-100 text-sm">Support</div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            HealthPulse
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h3>
                        <p className="text-gray-600 mb-6">Please provide your professional details to get started.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Profile Photo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo (Optional)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                        id="photo-input"
                                    />
                                    <label
                                        htmlFor="photo-input"
                                        className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                                    >
                                        {formData.photoPreview ? (
                                            <img
                                                src={formData.photoPreview}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Camera className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-600">Click to upload photo</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialization *
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        {specializations.map((spec) => (
                                            <option key={spec} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* License Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medical License Number *
                                </label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                                        placeholder="e.g., MD123456"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Years of Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Years of Experience *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                                        placeholder="e.g., 5"
                                        min="0"
                                        max="70"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Hospital/Clinic Affiliation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hospital/Clinic Affiliation *
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="hospitalAffiliation"
                                        value={formData.hospitalAffiliation}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                                        placeholder="e.g., City General Hospital"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Professional Bio *
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                                        placeholder="Brief description of your experience and expertise..."
                                        rows="4"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Completing Profile...' : 'Complete Profile'}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => onNavigate('landing')}
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
