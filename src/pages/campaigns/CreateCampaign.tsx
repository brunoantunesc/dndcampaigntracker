// src/pages/campaigns/CreateCampaign
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import SelectField from '../../components/form/SelectField';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';
import { World } from '../../interfaces/World';
import { authFetch } from '../../utils/authFetch.js';

interface CampaignFormData {
  name: string;
  startDate: string;
  endDate: string;
  world: string;
}

const CreateCampaign: React.FC = () => {
  const [form, setForm] = useState<CampaignFormData>({
    name: '',
    startDate: '',
    endDate: '',
    world: '',
  });

  const [worlds, setWorlds] = useState<World[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await authFetch('/api/worlds', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setWorlds(data);
        } else {
          console.error('Erro ao buscar mundos');
        }
      } catch (err) {
        console.error('Erro ao buscar mundos', err);
      }
    };

    fetchWorlds();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate('/campaigns');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao criar campanha');
      }
    } catch (err) {
      console.error('Erro ao criar campanha', err);
    }
  };

  return (
    <>
      <Header />
      <div className='text-center'>
        <FormWrapper title="Criar Nova Campanha" onSubmit={handleSubmit}>
          <InputField
            label="Campaign Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Campaign Name"
          />

          <InputField
            label="Start Date"
            name="startDate"
            value={form.startDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            type="date"
          />

          <InputField
            label="End Date (Optional)"
            name="endDate"
            value={form.endDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            type="date"
          />

          <SelectField
            label="World"
            name="world"
            value={form.world}
            onChange={handleSelectChange}
            options={worlds.map((world) => ({
              value: world._id,
              label: world.name,
            }))}
            placeholder="Select a world"
          />

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton type="submit">Save</CommonButton>
            <div>
              <CommonButton variant="secondary" onClick={() => navigate('/campaigns')}>
                Cancel
              </CommonButton>
            </div>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CreateCampaign;