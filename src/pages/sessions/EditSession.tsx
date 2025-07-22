import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';
import { authFetch } from '../../utils/authFetch';

interface Session {
  _id: string;
  title: string;
  summary: string;
  date: string;
  inGameDate: string;
  campaign: {
    _id: string;
    name: string;
  };
}

const EditSession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [form, setForm] = useState({
    summary: '',
    inGameDate: '',
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await authFetch(`/api/sessions/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          setForm({
            summary: data.summary || '',
            inGameDate: data.inGameDate || '',
          });
        } else {
          console.error('Failed to fetch session');
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };

    fetchSession();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await authFetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate('/sessions');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update session');
      }
    } catch (err) {
      console.error('Error updating session:', err);
    }
  };

  if (!session) return <div className="p-4">Loading...</div>;

  return (
    <>
      <Header />
      <div className="text-center">
        <FormWrapper title="Edit Session" onSubmit={handleSubmit}>
          <InputField
            label="Title"
            name="title"
            value={session.title}
            onChange={() => {}}
            readOnly
          />

          <InputField
            label="Date"
            name="date"
            type="date"
            value={session.date}
            onChange={() => {}}
            readOnly
          />

          <InputField
            label="Campaign"
            name="campaign"
            value={session.campaign.name}
            onChange={() => {}}
            readOnly
          />

          <InputField
            label="Summary"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Update session summary"
            type="textarea"
          />

          <InputField
            label="In-Game Date"
            name="inGameDate"
            value={form.inGameDate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
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

export default EditSession;
