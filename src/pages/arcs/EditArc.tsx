import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import { CommonButton, ToggleButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { authFetch } from '../../utils/authFetch';
import { Session } from '../../interfaces/Session';
import { Campaign } from '../../interfaces/Campaign';
import { Arc } from '../../interfaces/Arc';

const EditArc: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [arc, setArc] = useState<Arc | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [originalSessionIds, setOriginalSessionIds] = useState<string[]>([]);
  const [newSessionId, setNewSessionId] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const arcRes = await authFetch(`/api/arcs/${id}`);
        if (!arcRes.ok) throw new Error('Failed to fetch arc');
        const arcData: Arc = await arcRes.json();
        setArc(arcData);
        const originalIds = arcData.sessions.map(s => s._id);
        setSelectedSessionIds(originalIds);
        setOriginalSessionIds(originalIds);

        const sessionsRes = await authFetch('/api/sessions');
        if (!sessionsRes.ok) throw new Error('Failed to fetch sessions');
        const sessionsData: Session[] = await sessionsRes.json();
        setAllSessions(sessionsData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, [id]);

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleAddSession = async () => {
    const trimmedId = newSessionId.trim();
    if (!trimmedId) return;

    if (allSessions.find((s) => s._id === trimmedId)) {
      alert('Session already exists');
      setNewSessionId('');
      return;
    }

    try {
      const res = await authFetch(`/api/sessions/${trimmedId}`);
      if (!res.ok) {
        alert('Session not found');
        return;
      }
      const newSession: Session = await res.json();
      setAllSessions((prev) => [...prev, newSession]);
      setSelectedSessionIds((prev) => [...prev, newSession._id]);
      setNewSessionId('');
    } catch (err) {
      console.error('Error fetching session:', err);
      alert('Failed to fetch session data');
    }
  };

  // Função para verificar se houve alguma alteração
  const hasChanges = () => {
    if (!arc) return false;
    const sortedOriginal = [...originalSessionIds].sort();
    const sortedSelected = [...selectedSessionIds].sort();
    if (sortedOriginal.length !== sortedSelected.length) return true;
    return sortedOriginal.some((id, idx) => id !== sortedSelected[idx]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!hasChanges()) return; // Não salva se não houver mudanças

    try {
      const response = await authFetch(`/api/arcs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions: selectedSessionIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to update arc');
        return;
      }

      navigate('/arcs');
    } catch (err) {
      console.error('Error updating arc:', err);
    }
  };

  if (!arc) return <div className="p-4">Loading...</div>;

  return (
    <>
      <Header />
      <div className="text-center">
        <FormWrapper title="Edit Arc" onSubmit={handleSubmit}>
          <InputField label="Arc Name" name="name" value={arc.name} readOnly onChange={() => {}} />
          <InputField
            label="Campaign"
            name="campaign"
            value={arc.campaign?.name ?? 'Unknown'}
            readOnly
            onChange={() => {}}
          />

          <div className="text-left">
            <label className="block text-white font-medium mb-1">Sessions</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {allSessions.map((session) => (
                <ToggleButton
                  key={session._id}
                  selected={selectedSessionIds.includes(session._id)}
                  onClick={() => toggleSessionSelection(session._id)}
                >
                  {session.title}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-8 pt-8">
            <CommonButton disabled={!hasChanges()} type="submit">Save</CommonButton>
            <CommonButton variant="secondary" onClick={() => navigate('/arcs')}>
              Cancel
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default EditArc;
