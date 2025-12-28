// pages/RegisterPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEventContext } from "../../context/EventContext";
import { toastSuccess } from "../../../utility/toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  secretKey: string;
}

const RegisterPage: React.FC = () => {
  const { register } = useEventContext();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    secretKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"user" | "admin">("user");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!form.name || !form.email || !form.phone || !form.password) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }
    if (!emailRegex.test(form.email)) {
      setMessage("Invalid email address");
      setLoading(false);
      return;
    }

    try {
      const data = await register(form);

      if (data) {
        toastSuccess(data.message || "Registration successful!");
        navigate('/login');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetType = () => {
    setForm((prev) => ({ ...prev, secretKey: "" }));
    setMessage(null);
    setType("user");
  };

  return (
    <div className="pt-10 pb-10 w-full">
      <div className="w-full flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium">Create Account</h2>
          <p className="text-sm text-gray-500/90 mt-3">Join us by creating your account</p>

          <div className="flex items-center gap-5 mb-8 mt-4">
            <button type="button" onClick={resetType} className={`px-4 py-2 rounded-3xl border ${type === "user" ? 'bg-indigo-100' : ''} border-gray-100`}>
              Register as User
            </button>
            <button type="button" onClick={() => setType("admin")} className={`px-4 py-2 rounded-3xl border ${type === "admin" ? 'bg-indigo-100' : ''} border-gray-100`}>
              Register as Admin
            </button>
          </div>

          {message && (
            <div className="w-full bg-red-100 text-red-700 p-2 rounded text-sm mb-3 text-center">
              {message}
            </div>
          )}

          {/* Name */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-6">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
              required
            />
          </div>

          {type === "admin" && (
            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-6">
              <svg width="13" height="17" viewBox="0 0 13 17" fill="#6B7280">
                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" />
              </svg>
              <input
                type="password"
                name="secretKey"
                value={form.secretKey}
                onChange={handleChange}
                placeholder="Secret key for admin only"
                className="bg-transparent outline-none text-sm w-full text-gray-700"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;