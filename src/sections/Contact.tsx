"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaEnvelope,
  FaFacebook,
  FaTelegram,
  FaGithub,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaDownload,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

// Zod validation schema
const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email address is too long"), // RFC 5321 limit
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters for email compatibility"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  timeLeft?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, title, message, timeLeft }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="mb-4">
                {type === 'success' ? (
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <FaCheckCircle className="text-green-500 text-3xl" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                    <FaExclamationCircle className="text-orange-500 text-3xl" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {message}
              </p>

              {/* Time Left (for rate limit) */}
              {timeLeft && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-300">
                    <FaClock />
                    <span className="font-medium">Next message in: {timeLeft}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={onClose}
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  type === 'success'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
              >
                {type === 'success' ? 'Great!' : 'Got it'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Contact() {
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [timeUntilNextMessage, setTimeUntilNextMessage] = useState<string>("");
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    timeLeft?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange", // Real-time validation
  });

  const watchedFields = watch();
  
  useEffect(() => {
    checkMessageCooldown();
  }, []);

  const checkMessageCooldown = () => {
    const lastMessageTime = localStorage.getItem("lastMessageTime");
    if (lastMessageTime) {
      const lastTime = new Date(lastMessageTime).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTime;
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (timeDiff < oneDay) {
        setCanSendMessage(false);
        const timeLeft = oneDay - timeDiff;
        updateTimeUntilNextMessage(timeLeft);

        // Update countdown every minute
        const interval = setInterval(() => {
          const newTimeLeft = oneDay - (new Date().getTime() - lastTime);
          if (newTimeLeft <= 0) {
            setCanSendMessage(true);
            setTimeUntilNextMessage("");
            clearInterval(interval);
          } else {
            updateTimeUntilNextMessage(newTimeLeft);
          }
        }, 60000);

        return () => clearInterval(interval);
      }
    }
  };

  const updateTimeUntilNextMessage = (timeLeft: number) => {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    setTimeUntilNextMessage(`${hours}h ${minutes}m`);
  };

  const showModal = (type: 'success' | 'error', title: string, message: string, timeLeft?: string) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      timeLeft,
    });
  };

  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false,
    });
  };

  const onSubmit = (data: ContactFormData) => {
    if (!canSendMessage) {
      showModal(
        'error',
        'Rate Limit Reached',
        'You can only send one message per day to prevent spam. Please wait before sending another message.',
        timeUntilNextMessage
      );
      return;
    }

    // Create mailto link with form data
    const subject = encodeURIComponent(
      `Portfolio Contact: Message from ${data.name}`
    );
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
    );
    const mailtoLink = `mailto:tandara120403@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Record the message time
    localStorage.setItem("lastMessageTime", new Date().toISOString());

    // Update state
    setCanSendMessage(false);
    checkMessageCooldown();

    // Show success modal
    showModal(
      'success',
      'Message Sent!',
      'Thank you for your message! Your email client will open to send the message. I\'ll get back to you as soon as possible.'
    );
    
    reset(); // Reset form
  };

  const getCharacterCount = (fieldName: keyof ContactFormData) => {
    return watchedFields[fieldName]?.length || 0;
  };

  const getCharacterLimit = (fieldName: keyof ContactFormData) => {
    switch (fieldName) {
      case 'name':
        return 100;
      case 'email':
        return 254;
      case 'message':
        return 2000;
      default:
        return 0;
    }
  };

  const getCharacterCountColor = (fieldName: keyof ContactFormData) => {
    const count = getCharacterCount(fieldName);
    const limit = getCharacterLimit(fieldName);
    const percentage = (count / limit) * 100;
    
    if (percentage > 90) return 'text-red-500';
    if (percentage > 75) return 'text-orange-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <section className="py-28 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ready to collaborate or have a question? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="w-full mx-auto grid lg:grid-cols-2 gap-[200px]">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Let's Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, creative ideas,
                or potential collaborations. Whether you have a project in mind
                or just want to say hello, feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Email
                  </h4>
                  <a
                    href="mailto:tandara120403@gmail.com"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    tandara120403@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FaPhone className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Phone
                  </h4>
                  <a
                    href="tel:+1234567890"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    +855 87 408 530
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Location
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Phnom Penh, Cambodia
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Follow Me
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/dara.tan.583"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://t.me/TanDaras"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <FaTelegram />
                </a>
                <a
                  href="https://github.com/Raz-Zy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                >
                  <FaGithub />
                </a>
                <a
                  href="mailto:tandara120403@gmail.com"
                  className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>

            {/* Resume Download */}
            <div className="pt-8">
              <a
                href="/Tan_Dara_CV.pdf"
                download="Tan_Dara_CV.pdf"
                className="w-fit flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaDownload />
                Download Resume
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg card-hover"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Send Message
            </h3>

            {/* Rate Limiting Notice */}
            {!canSendMessage && (
              <div className="mb-6 p-4 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <FaClock />
                  <span className="font-medium">Rate Limit</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  You can send another message in {timeUntilNextMessage}. This
                  helps prevent spam.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  disabled={!canSendMessage}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.name 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="John Doe"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.name && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <FaExclamationTriangle size={12} />
                      <span>{errors.name.message}</span>
                    </div>
                  )}
                  <div className={`text-xs ${getCharacterCountColor('name')} ml-auto`}>
                    {getCharacterCount('name')}/{getCharacterLimit('name')}
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  disabled={!canSendMessage}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="john@example.com"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.email && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <FaExclamationTriangle size={12} />
                      <span>{errors.email.message}</span>
                    </div>
                  )}
                  <div className={`text-xs ${getCharacterCountColor('email')} ml-auto`}>
                    {getCharacterCount('email')}/{getCharacterLimit('email')}
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  rows={6}
                  disabled={!canSendMessage}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.message 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Tell me about your project or just say hello..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <FaExclamationTriangle size={12} />
                      <span>{errors.message.message}</span>
                    </div>
                  )}
                  <div className={`text-xs ${getCharacterCountColor('message')} ml-auto`}>
                    {getCharacterCount('message')}/{getCharacterLimit('message')}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSendMessage || !isValid || !isDirty}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600"
              >
                <FaPaperPlane />
                {canSendMessage
                  ? "Send Message"
                  : `Wait ${timeUntilNextMessage}`}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          timeLeft={modal.timeLeft}
        />
      </div>
    </section>
  );
}
