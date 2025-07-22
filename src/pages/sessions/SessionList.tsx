import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FormWrapper from '../../components/form/FormWrapper';
import { CommonButton } from '../../components/ui/Buttons';
import { authFetch } from '../../utils/authFetch';
import { spacing } from '../../styles/designSystem';
import { CardItem } from '../../components/ui/Cards';
import { Session } from '../../interfaces/Session';

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await authFetch('/api/sessions');
        if (response.ok) {
          const data: Session[] = await response.json();
          setSessions(data);
        } else {
          console.error('Erro ao buscar sessões');
        }
      } catch (err) {
        console.error('Erro na requisição de sessões', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <p className="text-center text-cyan-400">Carregando sessões...</p>;
  }

  return (
    <>
      <Header />

      <div className="p-6 max-w-screen-lg mx-auto text-center">
        <FormWrapper title="Minhas Sessões" onSubmit={e => e.preventDefault()}>
          <div style={{ paddingTop: spacing.xl }}>
            {sessions.length === 0 ? (
              <p className="text-gray-400">Nenhuma sessão encontrada</p>
            ) : (
              <ul className="space-y-4">
                {sessions.map(session => (
                  <CardItem
                    key={session._id}
                    onEdit={() => navigate(`/sessions/edit/${session._id}`)}
                    onDelete={() => console.log(`Deletar sessão ${session._id} (implementação futura)`)}
                  >
                    <h2 className="text-lg font-bold text-white">{session.title || '(Sem título)'}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Campaign: <span className="text-white">{session.campaign?.name || '-'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Summary: {session.summary?.trim() ? session.summary : '-'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      In-Game Date: {session.inGameDate?.trim() ? session.inGameDate : '-'}
                    </p>
                  </CardItem>
                ))}
              </ul>
            )}
          </div>

          <div style={{ paddingTop: spacing.xl }} className="mt-6">
            <CommonButton variant="primary" onClick={() => navigate('/sessions/create')}>
              New session
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default SessionList;
