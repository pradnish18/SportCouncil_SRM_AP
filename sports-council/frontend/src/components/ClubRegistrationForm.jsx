"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { clubs } from "./ClubsGrid";

const departments = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical & Electronics Engineering",
  "Biotechnology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Business Administration",
  "Economics",
  "English & Humanities",
  "Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

export default function ClubRegistrationForm({ onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    registrationNumber: "",
    department: "",
    yearOfStudy: "",
    phoneNumber: "",
    interestedClubs: [],
    skills: "",
    previousExperience: "",
    statement: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClubToggle = (clubId) => {
    setForm((prev) => ({
      ...prev,
      interestedClubs: prev.interestedClubs.includes(clubId)
        ? prev.interestedClubs.filter((id) => id !== clubId)
        : [...prev.interestedClubs, clubId],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
    if (!form.department) newErrors.department = "Select your department";
    if (!form.yearOfStudy) newErrors.yearOfStudy = "Select your year of study";
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,15}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Enter a valid phone number";
    if (form.interestedClubs.length === 0) newErrors.interestedClubs = "Select at least one club";
    if (!form.skills.trim()) newErrors.skills = "Skills/areas of interest is required";
    if (!form.statement.trim()) newErrors.statement = "Statement of interest is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus(data.error || "Submission failed");
      }
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl max-h-[70vh] overflow-y-auto glass rounded-[2.5rem] shadow-2xl no-scrollbar my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-10"
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-brand-srm text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-3">
              S
            </div>
            <h2 className="text-2xl font-syne font-bold">Join a Club</h2>
            <p className="text-xs text-muted font-outfit mt-1">
              Fill in your details and we'll connect you with the clubs you're interested in
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-2xl font-syne font-bold mb-2">Application Submitted!</h3>
              <p className="text-muted font-outfit max-w-md mx-auto">
                Thank you for your interest! The club administrators will review your application and reach out to you at your provided email address.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 rounded-2xl bg-brand-srm text-white font-bold hover:bg-brand-srm/90 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full p-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit text-sm"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                    SRM AP Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@srmap.edu.in"
                    className="w-full p-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit text-sm"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. AP2011001"
                    className="w-full p-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit text-sm"
                  />
                  {errors.registrationNumber && <p className="text-xs text-red-500 mt-1">{errors.registrationNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit text-sm"
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full p-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit text-sm"
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yearOfStudy"
                    value={form.yearOfStudy}
                    onChange={handleChange}
                    className="w-full p-3 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit text-sm"
                  >
                    <option value="">Select year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.yearOfStudy && <p className="text-xs text-red-500 mt-1">{errors.yearOfStudy}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                  Interested Club(s) <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {clubs.map((club) => (
                    <button
                      key={club.id}
                      type="button"
                      onClick={() => handleClubToggle(club.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-outfit ${
                        form.interestedClubs.includes(club.id)
                          ? "bg-brand-srm text-white"
                          : "glass text-muted hover:text-foreground"
                      }`}
                    >
                      {club.icon} {club.name}
                    </button>
                  ))}
                </div>
                {errors.interestedClubs && <p className="text-xs text-red-500 mt-1">{errors.interestedClubs}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                  Skills / Areas of Interest <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g. batting, serving, strategic planning, fitness training..."
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit"
                />
                {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                  Previous Experience <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  name="previousExperience"
                  value={form.previousExperience}
                  onChange={handleChange}
                  placeholder="Any past sports experience, achievements, or training..."
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 font-outfit">
                  Statement of Interest <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="statement"
                  value={form.statement}
                  onChange={handleChange}
                  placeholder="Why do you want to join? What do you hope to contribute and learn?"
                  rows={4}
                  className="w-full p-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit"
                />
                {errors.statement && <p className="text-xs text-red-500 mt-1">{errors.statement}</p>}
              </div>

              {typeof status === "string" && status !== "success" && (
                <p className="text-sm text-red-500 font-outfit bg-red-500/10 rounded-xl px-4 py-3">
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-brand-srm text-white font-bold font-outfit hover:bg-brand-srm/90 transition-colors disabled:opacity-50 text-sm"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
