import { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { AxiosError } from "axios";
import { PersonalInfoType } from "../../interface/PersonalInfo";
import { Alert } from "flowbite-react";

interface FormEditPersonalInfoProps {
  personalInfo: PersonalInfoType;
  onCancel: () => void;
  onSuccess: (updatedInfo: PersonalInfoType) => void;
}

export default function FormEditPersonalInfo({
  personalInfo,
  onCancel,
  onSuccess,
}: FormEditPersonalInfoProps) {
  const [formData, setFormData] = useState(personalInfo);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false); // State untuk drag-and-drop

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 1MB");
      return;
    }
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const newPhotoUrl = e.target.result as string;
          setPreviewPhoto(newPhotoUrl); // Simpan URL untuk preview
          setFormData((prev) => ({
            ...prev,
            profile_photo: file, // Simpan file asli, bukan nama file
          }));
        }
      };
      reader.readAsDataURL(file); // Hanya untuk preview
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Handle drag-and-drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Buat objek FormData
    const formDataToSend = new FormData();

    // Tambahkan field ke FormData
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("job_title", formData.job_title || "");
    formDataToSend.append("bio", formData.bio || "");
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append(
      "years_experience",
      formData.years_experience?.toString() || ""
    );
    formDataToSend.append(
      "total_projects",
      formData.total_projects?.toString() || ""
    );
    formDataToSend.append(
      "total_technologies",
      formData.total_technologies?.toString() || ""
    );

    // Jika ada file gambar, tambahkan ke FormData
    if (formData.profile_photo && typeof formData.profile_photo === "object") {
      formDataToSend.append("profile_photo", formData.profile_photo);
    }

    try {
      console.log("Sending request with data:", JSON.stringify(formDataToSend));
      const response = await axiosInstance.patch(
        `/api/personal-info/${personalInfo.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Penting untuk file upload
          },
        }
      );

      if (response.data.status) {
        onSuccess(response.data.data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update information");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Personal Information</h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
          Cancel
        </button>
      </div>

      {error && (
        <Alert
          color="failure"
          onDismiss={() => setError(null)}
          className="mb-4">
          <span>{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title || ""}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Profile Photo Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <div
            className={`relative w-full h-48 rounded-lg shadow-lg border-2 border-dashed ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } flex items-center justify-center`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            {previewPhoto || typeof formData.profile_photo === "string" ? (
              <img
                src={
                  previewPhoto ||
                  (typeof formData.profile_photo === "string"
                    ? formData.profile_photo
                    : undefined)
                } // Hanya string yang digunakan sebagai src
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500 text-center">
                Drag & drop an image here or click to upload
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Years Experience
            </label>
            <input
              type="number"
              name="years_experience"
              value={formData.years_experience || ""}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Projects
            </label>
            <input
              type="number"
              name="total_projects"
              value={formData.total_projects || ""}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Technologies
            </label>
            <input
              type="number"
              name="total_technologies"
              value={formData.total_technologies || ""}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
