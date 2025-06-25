import { useState } from "react";

export default function FormAddPersonalInfo() {
  const [info, setInfo] = useState({
    name: "",
    role: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kirim data ke API
    fetch("/api/personal-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    })
      .then(() => alert("Personal Info Updated!"))
      .catch((error) => console.error("Error updating personal info:", error));
  };
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Personal Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={info.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={info.role}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={info.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save
        </button>
      </form>
    </>
  );
}
