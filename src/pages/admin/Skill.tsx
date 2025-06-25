import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { Skill as SkillType, SkillCategory } from "../../interface/Skill";
import { Alert, Button, Modal, Spinner } from "flowbite-react";

const Skill: React.FC = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: SkillCategory.WEB_DEVELOPER,
    icon: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State untuk modal hapus
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null); // State untuk menyimpan ID skill yang akan dihapus
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State untuk pesan alert
  const [alertType, setAlertType] = useState<"success" | "failure">("success"); // State untuk tipe alert

  // Key untuk localStorage
  const localStorageKey = "skillsData";

  // Fetch data skill dari API atau dari localStorage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const localData = localStorage.getItem(localStorageKey);

      if (localData) {
        setSkills(JSON.parse(localData));
        setLoading(false);
      } else {
        try {
          const response = await axiosInstance.get("/api/skill");
          const data = response.data.data;
          setSkills(data);
          localStorage.setItem(localStorageKey, JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching skills:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  // Handler untuk perubahan input form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/skill", formData);
      console.log("Response from API:", response.data); // Debugging

      // Akses data skill dari response.data.data
      const newSkill = response.data.data; // Perbaikan di sini
      const updatedSkills = [...skills, newSkill]; // Tambahkan skill baru ke state
      console.log("Updated Skills:", updatedSkills); // Debugging

      setSkills(updatedSkills); // Perbarui state
      localStorage.setItem(localStorageKey, JSON.stringify(updatedSkills)); // Perbarui localStorage

      setFormData({
        name: "",
        category: SkillCategory.WEB_DEVELOPER,
        icon: "",
      });
      setShowForm(false); // Sembunyikan form
      setAlertMessage("Skill berhasil ditambahkan!");
      setAlertType("success");
    } catch (error) {
      console.error("Error adding skill:", error);
      setAlertMessage("Gagal menambahkan skill.");
      setAlertType("failure");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler untuk menghapus skill dengan konfirmasi
  const handleDelete = async (id: string) => {
    setSelectedSkillId(id); // Simpan ID skill yang akan dihapus
    setShowDeleteModal(true); // Tampilkan modal konfirmasi
  };

  // Handler untuk konfirmasi penghapusan
  const confirmDelete = async () => {
    if (selectedSkillId) {
      try {
        await axiosInstance.delete(`/api/skill/${selectedSkillId}`);
        const updatedSkills = skills.filter(
          (skill) => skill.id !== selectedSkillId
        );
        setSkills(updatedSkills);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedSkills));
        setAlertMessage("Skill berhasil dihapus!"); // Tampilkan alert sukses
        setAlertType("success");
      } catch (error) {
        console.error("Error deleting skill:", error);
        setAlertMessage("Gagal menghapus skill."); // Tampilkan alert gagal
        setAlertType("failure");
      } finally {
        setShowDeleteModal(false); // Tutup modal
        setSelectedSkillId(null); // Reset ID skill
      }
    }
  };

  // Handler untuk edit skill
  const handleEdit = (id: string) => {
    const skillToEdit = skills.find((skill) => skill.id === id);
    if (skillToEdit) {
      setFormData({
        name: skillToEdit.name,
        category: skillToEdit.category,
        icon: skillToEdit.icon || "",
      });
      setShowForm(true);
    }
  };

  // Tampilkan animasi loading jika data sedang di-fetch
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="#3b82f6" size={50} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Skill</h2>

      {/* Tombol "Tambah Skill" */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="text-white rounded mb-4 text-sm py-1 px-3 hover:bg-blue-500 bg-blue-600">
        {showForm ? "Tutup Form" : "Tambah Skill"}
      </button>

      {/* Tampilkan alert jika ada pesan */}
      {alertMessage && (
        <Alert
          color={alertType}
          onDismiss={() => setAlertMessage(null)} // Sembunyikan alert saat diklik
          className="mb-4">
          {alertMessage}
        </Alert>
      )}

      {/* Tampilkan form atau list skill */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Skill Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required>
            {Object.values(SkillCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="icon"
            placeholder="Icon URL"
            value={formData.icon}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded flex items-center justify-center"
            disabled={isSubmitting} // Nonaktifkan tombol saat sedang submit
          >
            {isSubmitting ? (
              <Spinner color="#ffffff" size={20} /> // Tampilkan animasi loading
            ) : (
              "Add Skill"
            )}
          </Button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="border p-4 rounded">
                <h3 className="text-lg font-bold">{skill.name}</h3>
                <p className="text-sm">{skill.category}</p>
                {skill.icon && (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-8 h-8 mt-2"
                  />
                )}
                <button
                  onClick={() => handleEdit(skill.id)}
                  className="bg-yellow-500 text-white p-2 rounded mt-2 mr-2 text-sm py-1 px-3 hover:bg-yellow-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="bg-red-500 text-white p-2 rounded mt-2 text-sm py-1 px-3 hover:bg-red-600">
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No skills found.</p>
          )}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md">
        <Modal.Header>Konfirmasi Hapus</Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus skill ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={confirmDelete}
            className="bg-red-500 text-white p-2 rounded">
            Ya, Hapus
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-500 text-white p-2 rounded ml-2">
            Batal
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Skill;
