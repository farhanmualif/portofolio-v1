import React from "react";
import sgMail from "@sendgrid/mail";

export default function FormEmail() {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const handleInput = (e: {
    target: {
      name: string;
      value: string;
    };
  }) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { name, email, subject, message } = data;

    // Validasi input (contoh sederhana)
    if (!name || !email || !subject || !message) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const msg = {
      to: "paam6765@example.com", // Change to your recipient
      from: email, // Change to your verified sender
      subject: subject,
      text: message,
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form className="w-[80%] mx-auto" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-blue-gray-100">
          Your name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleInput}
          className="bg-gray-50 border border-gray-300 text-blue-gray-100 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Name"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-blue-gray-100">
          Your email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleInput}
          placeholder="Email"
          className="bg-gray-50 border border-gray-300 text-blue-gray-100 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="subject"
          className="block mb-2 text-sm font-medium text-blue-gray-100">
          Your subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={data.subject}
          onChange={handleInput}
          placeholder="Subject"
          className="bg-gray-50 border border-gray-300 text-blue-gray-100 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-blue-gray-100">
          Your message
        </label>
        <textarea
          id="message"
          rows={5}
          name="message"
          value={data.message}
          onChange={handleInput}
          className="block p-2.5 w-full text-sm text-blue-gray-100 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Leave a comment..."></textarea>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Submit
      </button>
    </form>
  );
}
