import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FormWrapper from '../../components/form/FormWrapper';
import { CommonButton, ToggleButton } from '../../components/ui/Buttons';
import InputField from '../../components/form/InputField';
import { spacing } from '../../styles/designSystem';
import { Session } from '../../interfaces/Session';
import { Campaign } from '../../interfaces/Campaign';

const CreateArc: React.FC = () => {
  const [name, setName] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCampaigns(response.data);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get('/api/sessions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    fetchCampaigns();
    fetchSessions();
  }, []);

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessionIds(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        '/api/arcs',
        {
          name,
          campaign: selectedCampaignId,
          sessions: selectedSessionIds,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      navigate('/arcs');
    } catch (error) {
      console.error('Failed to create arc:', error);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: spacing.lg }} className="max-w-screen-lg mx-auto">
        <FormWrapper title="Create Arc" onSubmit={handleSubmit}>
          <InputField
            label="Arc Name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter the arc name"
          />

          <div style={{ paddingTop: spacing.md }}>
            <label className="text-white block mb-2 font-medium">Campaign</label>
            <select
              value={selectedCampaignId}
              onChange={e => setSelectedCampaignId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-black border-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="">Select a campaign</option>
              {campaigns.map(campaign => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ paddingTop: spacing.md }} className="mt-6">
            <label className="text-white block mb-2 font-medium">Sessions (optional)</label>
            <div className="flex gap-2 mb-2 flex-wrap max-h-60 overflow-auto">
              {sessions.length === 0 && <p className="text-gray-400">No sessions available</p>}
              {sessions.map(session => (
                <ToggleButton
                  key={session._id}
                  selected={selectedSessionIds.includes(session._id)}
                  onClick={() => toggleSessionSelection(session._id)}
                >
                  {session.title} ({session.date ? new Date(session.date).toLocaleDateString() : '-'})
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton type="submit">Save</CommonButton>
            <CommonButton variant="secondary" onClick={() => navigate('/arcs')}>
              Cancel
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CreateArc;
