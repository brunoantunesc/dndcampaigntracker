import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FormWrapper from '../../components/form/FormWrapper';
import { CommonButton } from '../../components/ui/Buttons';
import { authFetch } from '../../utils/authFetch';
import { spacing } from '../../styles/designSystem';
import { CardItem } from '../../components/ui/Cards';
import { Arc } from '../../interfaces/Arc';

const ArcList: React.FC = () => {
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArcs = async () => {
      try {
        const response = await authFetch('/api/arcs');
        if (response.ok) {
          const data: Arc[] = await response.json();
          setArcs(data);
        } else {
          console.error('Failed to fetch arcs');
        }
      } catch (err) {
        console.error('Error fetching arcs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArcs();
  }, []);

  if (loading) {
    return <p className="text-center text-cyan-400">Loading arcs...</p>;
  }

  return (
    <>
      <Header />

      <div className="p-6 max-w-screen-lg mx-auto text-center">
        <FormWrapper title="My Arcs" onSubmit={e => e.preventDefault()}>
          <div style={{ paddingTop: spacing.xl }}>
            {arcs.length === 0 ? (
              <p className="text-gray-400">No arcs found</p>
            ) : (
              <ul className="space-y-4">
                {arcs.map(arc => (
                  <CardItem
                    key={arc._id}
                    onEdit={() => navigate(`/arcs/edit/${arc._id}`)}
                    onDelete={() => console.log(`Delete arc ${arc._id} (future implementation)`)}
                  >
                    <h2 className="text-lg font-bold text-white">{arc.name || '(No name)'}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Campaign: { arc.campaign.name }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sessions: { arc.sessions.length }
                    </p>
                  </CardItem>
                ))}
              </ul>
            )}
          </div>

          <div style={{ paddingTop: spacing.xl }} className="mt-6">
            <CommonButton variant="primary" onClick={() => navigate('/arcs/create')}>
              New Arc
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default ArcList;
