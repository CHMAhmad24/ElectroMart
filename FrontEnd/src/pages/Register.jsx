import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    Fname: '',
    Lname: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://electromart-backend-five.vercel.app/api/users/s', formData);
      if (res.data.success) {
        alert('Registration successful! Click Login to continue.');
      } else {
        alert(res.data.message || 'Registration failed');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error connecting to server');
    }
  };

  return (
    <div className="form_box register">
      <form onSubmit={handleSubmit}>
        <h1>Registration</h1>
        <div className="input_box">
          <input
            type="text"
            name="Fname"
            placeholder="First Name"
            required
            value={formData.Fname}
            onChange={handleChange}
          />
        </div>
        <div className="input_box">
          <input
            type="text"
            name="Lname"
            placeholder="Last Name"
            required
            value={formData.Lname}
            onChange={handleChange}
          />
        </div>
        <div className="input_box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input_box">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="BTN">Register</button>
      </form>
    </div>
  );
}

export default Register;