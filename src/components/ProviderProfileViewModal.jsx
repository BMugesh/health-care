import { X, User, Briefcase, Award, Building2, FileText, Phone, Mail } from 'lucide-react';

export default function ProviderProfileViewModal({ isOpen, onClose, providerData }) {
    if (!isOpen || !providerData) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Provider Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-900 hover:bg-black/10 rounded-lg p-1 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Header Info */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                            {providerData.photoPreview ? (
                                <img
                                    src={providerData.photoPreview}
                                    alt={providerData.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-primary-600">
                                    {providerData.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('') || 'DR'}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{providerData.name}</h3>
                        <p className="text-primary-600 font-medium">{providerData.specialization || 'Healthcare Provider'}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Mail className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium text-gray-500">Email</span>
                            </div>
                            <p className="text-gray-900 font-medium">{providerData.email}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium text-gray-500">Affiliation</span>
                            </div>
                            <p className="text-gray-900 font-medium">{providerData.hospitalAffiliation || 'N/A'}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Award className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium text-gray-500">License Number</span>
                            </div>
                            <p className="text-gray-900 font-medium">{providerData.licenseNumber || 'N/A'}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Briefcase className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium text-gray-500">Experience</span>
                            </div>
                            <p className="text-gray-900 font-medium">{providerData.yearsOfExperience ? `${providerData.yearsOfExperience} Years` : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <FileText className="w-5 h-5 text-primary-600" />
                            <span className="text-sm font-medium text-gray-500">Professional Bio</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            {providerData.bio || 'No bio available.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
