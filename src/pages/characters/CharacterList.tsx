import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/ui/Header';
import FormWrapper from '../../components/form/FormWrapper';
import { CommonButton } from '../../components/ui/Buttons';
import { spacing } from '../../styles/designSystem';
import { CardItem } from '../../components/ui/Cards';
import { useNavigate } from 'react-router-dom';
import { Character } from '../../interfaces/Character';

const CharactersList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get('/api/characters', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCharacters(response.data);
      } catch (error) {
        console.error('Erro ao buscar personagens', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return <p className="text-center">Carregando personagens...</p>;
  }

  return (
    <>
      <Header />

      <div className="p-6 max-w-screen-lg mx-auto text-center">
        <FormWrapper title="My Characters" onSubmit={(e) => e.preventDefault()}>
          <div style={{ paddingTop: spacing.xl }}>
            {characters.length === 0 ? (
              <p className="text-gray-400">No characters found.</p>
            ) : (
              <ul className="space-y-4">
                {characters.map((char) => (
                  <CardItem 
                    key={char._id}
                    onEdit={() => navigate(`/characters/edit/${char._id}`)}
                    onDelete={() => console.log(`Deletar personagem ${char._id} (implementação futura)`)}
                  >
                    <h2 className="text-lg font-bold text-white">{char.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {`Level ${char.level}`} {char.race}
                      <br />
                      {char.subclass ? char.subclass : ''} {char.characterClass}
                      <br />
                      Born in {char.birthDate}
                    </p>
                  </CardItem>
                ))}
              </ul>
            )}
          </div>

          <div style={{ paddingTop: spacing.xl }} className="mt-6">
            <CommonButton variant="primary" onClick={() => window.location.href = '/characters/create'}>
              Create new character
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CharactersList;
