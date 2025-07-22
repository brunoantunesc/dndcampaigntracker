import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import FormWrapper from '../../components/form/FormWrapper';
import { CommonButton } from '../../components/Buttons';
import { authFetch } from '../../utils/authFetch.js';
import { spacing } from '../../styles/designSystem.js';
import { World } from '../../interfaces/World';

const WorldList: React.FC = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await authFetch('/api/worlds');
        if (response.ok) {
          const data: World[] = await response.json();
          setWorlds(data);
        } else {
          console.error('Failed to fetch worlds');
        }
      } catch (err) {
        console.error('Error fetching worlds', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorlds();
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading worlds...</p>;
  }

  return (
    <>
  <Header />

  <div className="p-6 max-w-screen-lg mx-auto text-center">
    <FormWrapper title="My Worlds" onSubmit={(e) => e.preventDefault()}>
      {worlds.length === 0 ? (
        <div className="mt-12 flex flex-col items-center px-4 sm:px-8">
          <p className="mb-4 text-gray-700 text-lg text-center max-w-md">
            You haven’t created any worlds yet.
          </p>
          <div style={{ paddingTop: spacing.lg }}>
            <CommonButton onClick={() => navigate('/worlds/create')}>
              Create Your First World
            </CommonButton>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {worlds.map((world) => (
              <li key={world._id} className="p-4 border border-blue-500 rounded-lg">
                <h2 className="text-lg font-bold text-white">{world.name}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Descrição: {world.description}
                </p>
              </li>
            ))}
          </ul>

          <div style={{ paddingTop: spacing.xl }} className="mt-6">
            <CommonButton variant="primary" onClick={() => navigate('/worlds/create')}>
              Criar novo mundo
            </CommonButton>
          </div>
        </>
      )}
    </FormWrapper>
  </div>
</>
  );
};

export default WorldList;