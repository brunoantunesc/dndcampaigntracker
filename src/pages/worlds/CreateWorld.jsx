// src/pages/CreateWorld.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import InputField from '../../components/form/InputField.tsx';
import CommonButton from '../../components/Buttons.tsx';
import { authFetch } from '../../utils/authFetch';
import FormWrapper from '../../components/form/FormWrapper.tsx';
import { spacing } from '../../styles/designSystem.js';

const CreateWorld = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authFetch('/api/worlds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const newWorld = await response.json();
        navigate(`/worlds/${newWorld._id}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create world');
      }
    } catch (err) {
      console.error('Error creating world', err);
    }
  };

  return (
    <>
    <Header />
    <div style={{paddingTop: spacing.lg, paddingLeft: spacing.lg}} >
      <FormWrapper title="Create New World" onSubmit={handleSubmit}>
        <InputField
          label="World Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter a name for your world"
        />

        <InputField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
        />
        
        <div style={{paddingTop: spacing.lg}}>
          <CommonButton type="submit">Create World</CommonButton>
        </div>
      </FormWrapper>
    </div>
  </>
  );
};

export default CreateWorld;
