import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { AxiosError } from "axios";
import { Spinner } from "flowbite-react";
import FormEditPersonalInfo from "./FormEditPersoalInfo";
import { PersonalInfoType } from "../../interface/PersonalInfo";

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data dari API saat komponen dimuat
  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  // Fungsi untuk mengambil data personal info dari backend
  const fetchPersonalInfo = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/personal-info");

      if (response.data.status && response.data.data.length > 0) {
        const data = response.data.data[0];
        setPersonalInfo(data); // Set data langsung ke state
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "Failed to fetch personal information"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi yang dipanggil setelah update berhasil
  const handleUpdateSuccess = (updatedInfo: PersonalInfoType) => {
    setPersonalInfo(updatedInfo); // Perbarui state dengan data terbaru
    setIsEditing(false);
  };

  // Tampilkan spinner saat loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Try Again
        </button>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada data personal info
  if (!personalInfo) {
    return (
      <div className="text-gray-500 text-center p-4">
        No personal information found
      </div>
    );
  }

  // Tampilkan form edit jika sedang dalam mode editing
  if (isEditing) {
    return (
      <FormEditPersonalInfo
        personalInfo={personalInfo}
        onCancel={() => setIsEditing(false)}
        onSuccess={handleUpdateSuccess}
      />
    );
  }

  // Tampilkan data personal info
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm py-1 px-3">
          Edit Info
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Photo Section */}
        <div className="md:col-span-1">
          <img
            src={
              typeof personalInfo.profile_photo === "string"
                ? personalInfo.profile_photo
                : ""
            }
            alt={personalInfo.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Information Section */}
        <div className="md:col-span-2">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {personalInfo.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {personalInfo.job_title}
              </p>
              <p className="text-gray-600 mt-2">{personalInfo.bio}</p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Contact</h4>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {personalInfo.email}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {personalInfo.years_experience}+
                </p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {personalInfo.total_projects}+
                </p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {personalInfo.total_technologies}+
                </p>
                <p className="text-sm text-gray-600">Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
