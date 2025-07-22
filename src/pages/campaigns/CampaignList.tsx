// src/pages/campaigns/CampaignsList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import FormWrapper from '../../components/form/FormWrapper.tsx';
import { CommonButton } from '../../components/Buttons.tsx';
import { authFetch } from '../../utils/authFetch.js';
import { spacing } from '../../styles/designSystem.js';
import { Campaign } from '../../interfaces/Campaign.tsx';

const CampaignsList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await authFetch('/api/campaigns');
        if (response.ok) {
          const data: Campaign[] = await response.json();
          setCampaigns(data);
        } else {
          console.error('Erro ao buscar campanhas');
        }
      } catch (err) {
        console.error('Erro na requisição de campanhas', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <p className="text-center text-cyan-400">Carregando campanhas...</p>;
  }

  return (
    <>
      <Header />

      <div
        style={{ paddingLeft: spacing.lg, paddingTop: spacing.lg }}
        className="p-6 max-w-screen-lg mx-auto"
      >
        <FormWrapper title="Minhas Campanhas" onSubmit={(e) => e.preventDefault()}>
          <div style={{ paddingTop: spacing.xl }}>
            {campaigns.length === 0 ? (
              <p className="text-gray-400">Nenhuma campanha encontrada.</p>
            ) : (
              <ul className="space-y-4">
                {campaigns.map((campaign) => (
                  <li key={campaign._id} className="p-4 border border-cyan-400 rounded-lg">
                    <h2 className="text-lg font-bold text-white">{campaign.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Mundo: <span className="text-white">{campaign.world?.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Início: {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                    {campaign.endDate && (
                      <p className="text-xs text-gray-500">
                        Fim: {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Arcos: {campaign.arcs?.length ?? 0}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ paddingTop: spacing.xl }} className="mt-6">
            <CommonButton variant="primary" onClick={() => navigate('/campaigns/create')}>
              Criar nova campanha
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CampaignsList;
