// src/pages/campaigns/CampaignsList
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FormWrapper from '../../components/form/FormWrapper';
import { CommonButton } from '../../components/ui/Buttons';
import { authFetch } from '../../utils/authFetch.js';
import { spacing } from '../../styles/designSystem.js';
import { Campaign } from '../../interfaces/Campaign';
import ActionMenuButton from '../../components/ui/ActionMenuButton';
import { CardItem } from '../../components/ui/Cards';

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
        className="p-6 max-w-screen-lg mx-auto text-center"
      >
        <FormWrapper title="My Campaigns" onSubmit={(e) => e.preventDefault()}>
          <div style={{ paddingTop: spacing.xl }}>
            {campaigns.length === 0 ? (
              <p className="text-gray-400">No campaigns found</p>
            ) : (
              <ul className="space-y-4">
                {campaigns.map((campaign) => (
                  <CardItem 
                    key={campaign._id} 
                    onEdit={() => navigate(`/campaigns/edit/${campaign._id}`)}
                    onDelete={() => console.log(`Deletar campanha ${campaign._id} (implementação futura)`)}
                  >
                    <h2 className="text-lg font-bold text-white">{campaign.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Mundo: <span className="text-white">{campaign.world?.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Início: {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Fim: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '-'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Arcos: {campaign.arcs?.length ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sessões: { /* TODO: Mapear todos os arcos para obter o número de sessões */ campaign.arcs?.reduce((total, arc) => total + arc.sessions?.length, 0) }
                    </p>
                  </CardItem>
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
