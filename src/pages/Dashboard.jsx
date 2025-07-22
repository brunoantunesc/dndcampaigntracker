// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import FormWrapper from '../components/form/FormWrapper';
import {CommonButton} from '../components/ui/Buttons';
import { spacing } from '../styles/designSystem.js';

const Home = () => {
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName')

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await authFetch('/api/worlds');
        if (response.ok) {
          const data = await response.json();
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

  if (loading) return <p className="p-4 text-center">Loading worlds...</p>;

  return (
    <>
    <Header />

    <div style={{ paddingLeft: spacing.lg, paddingTop: spacing.lg }} className="flex flex-col items-center px-4 sm:px-8">
        <div className="mb-8">
          Welcome back, {userName}!
        </div>
        
        <FormWrapper title="Your Worlds" onSubmit={(e) => e.preventDefault()}>
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
              <ul className="space-y-8">
                {worlds.map((world) => (
                  <li key={world._id} className="p-4 border border-blue-500 rounded-lg">
                    <h2 className="text-lg font-bold text-white">{world.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Descrição: {world.description}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </FormWrapper>
      </div>
    </>
  );
};

export default Home;


