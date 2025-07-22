import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import WorldCard from '../../components/WorldCard.jsx';
import { CommonButton } from '../../components/Buttons.tsx';
import { authFetch } from '../../utils/authFetch.js';
import { spacing } from '../../styles/designSystem.js';
import { World } from '../../interfaces/World.tsx';

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

      <div
        style={{ paddingLeft: spacing.lg, paddingTop: spacing.lg }}
        className="p-6 max-w-screen-lg mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4">Your Worlds</h1>
        {worlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worlds.map((world) => (
              <WorldCard key={world._id} world={world} />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default WorldList;