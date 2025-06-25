import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Contact() {
  const socialLinks = [
    {
      icon: <FaGithub className="text-2xl" />,
      url: "https://github.com/farhanmualif",
      label: "GitHub",
      color: "hover:text-gray-400",
    },
    {
      icon: <FaLinkedin className="text-2xl" />,
      url: "https://www.linkedin.com/in/farhan-mualif/",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: <FaInstagram className="text-2xl" />,
      url: "https://www.instagram.com/farhan.mualif_/",
      label: "Instagram",
      color: "hover:text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 lg:px-20 bg-gradient-to-t from-transparent to-blue-gray-900/20">
      <div className="max-w-4xl w-full" data-aos="fade-up">
        <h1
          className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center mb-12"
          id="contact">
          Let's Connect
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-blue-gray-800/30 p-8 rounded-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-gray-100 mb-6">
              Send me a message
            </h2>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-blue-gray-900/50 border border-blue-gray-700 text-blue-gray-100 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-blue-gray-900/50 border border-blue-gray-700 text-blue-gray-100 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-blue-gray-900/50 border border-blue-gray-700 text-blue-gray-100 focus:border-blue-400 focus:outline-none transition-colors resize-none"></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-blue-gray-800/30 p-8 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <FaEnvelope className="text-3xl text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-blue-gray-100">
                    Email
                  </h3>
                  <p className="text-blue-gray-300">farhanmualif8@gmail.com</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-blue-gray-200">
                  Feel free to reach out to me for collaboration or just to say
                  hi!
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-blue-gray-300 ${link.color} transition-colors p-2 hover:scale-110 transform duration-200`}
                      aria-label={link.label}>
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-blue-gray-100 mb-4">
                Available for Opportunities
              </h3>
              <p className="text-blue-gray-200">
                I'm currently open for freelance projects and full-time
                positions. Let's work together to create something amazing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
