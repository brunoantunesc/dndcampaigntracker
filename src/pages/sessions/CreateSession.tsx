import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import SelectField from '../../components/form/SelectField';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';
import { authFetch } from '../../utils/authFetch';

interface SessionFormData {
  title: string;
  summary: string;
  date: string;
  inGameDate: string;
  campaign: string;
}

interface Campaign {
  _id: string;
  name: string;
}

const CreateSession: React.FC = () => {
  const [form, setForm] = useState<SessionFormData>({
    title: '',
    summary: '',
    date: '',
    inGameDate: '',
    campaign: '',
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await authFetch('/api/campaigns');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        } else {
          console.error('Error fetching campaigns');
        }
      } catch (err) {
        console.error('Error fetching campaigns', err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await authFetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate('/sessions');
      } else {
        const error = await response.json();
        alert(error.message || 'Error creating session');
      }
    } catch (err) {
      console.error('Error creating session', err);
    }
  };

  return (
    <>
      <Header />
      <div className='text-center'>
        <FormWrapper title="Create New Session" onSubmit={handleSubmit}>
          <InputField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Session title"
          />

          <InputField
            label="Summary"
            name="summary"
            value={form.summary}
            onChange={handleInputChange}
            placeholder="Session summary"
            type="textarea"
          />

          <InputField
            label="Date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            type="date"
          />

          <InputField
            label="In-Game Date"
            name="inGameDate"
            value={form.inGameDate}
            onChange={handleInputChange}
            placeholder="In-game date"
          />

          <SelectField
            label="Campaign"
            name="campaign"
            value={form.campaign}
            onChange={handleSelectChange}
            options={campaigns.map(c => ({ value: c._id, label: c.name }))}
            placeholder="Select a campaign"
          />

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton type="submit">Save</CommonButton>
            <div>
              <CommonButton variant="secondary" onClick={() => navigate('/sessions')}>
                Cancel
              </CommonButton>
            </div>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CreateSession;
