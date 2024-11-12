// app/studentReport/page.js or pages/studentReport.js

"use client";

import { useState } from "react";

const subjects = [
  "Communicative English – Reading Skills",
  "Reading Comprehension",
  "Vocabulary Development",
  "Socio Emotional Skills Management",
  "Retail Management - Basic - Money Transaction",
  "Retail Management - Product Estimation",
  "Banking Skills and Digital Payment",
  "Customer Interaction Skills",
  "TILS - 1: GTBT, The Changing Me",
  "TILS - 2: Safety and First Aid",
  "Functional Computer Skills - 1 [FCS - 1]",
  "Computer Data Entry",
  "Housekeeping",
];

const ReportCardForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    comments: "",
    grades: subjects.reduce((acc, subject) => {
      acc[subject] = ""; // Initialize all subject grades as empty
      return acc;
    }, {}),
  });

  const handleChange = (e, subject) => {
    setFormData({
      ...formData,
      grades: {
        ...formData.grades,
        [subject]: e.target.value.toUpperCase(),
      },
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value.charAt(0).toUpperCase() + value.slice(1),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/generate-report", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.name}_ReportCard.pdf`;
    link.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg mx-auto">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Student Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>

      <div>
        <label
          htmlFor="className"
          className="block text-sm font-medium text-gray-700"
        >
          Class
        </label>
        <input
          id="className"
          type="text"
          value={formData.className}
          onChange={handleInputChange}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>

      <div>
        <label
          htmlFor="comments"
          className="block text-sm font-medium text-gray-700"
        >
          Comments
        </label>
        <textarea
          id="comments"
          value={formData.comments}
          onChange={handleInputChange}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold">Grades</h3>
        {subjects.map((subject) => (
          <div key={subject} className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              {subject}
            </label>
            <input
              type="text"
              value={formData.grades[subject]}
              onChange={(e) => handleChange(e, subject)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full"
      >
        Generate Report Card
      </button>
    </form>
  );
};

export default ReportCardForm;
