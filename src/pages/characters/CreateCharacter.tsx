import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';
import { authFetch } from '../../utils/authFetch';
import { Character } from '../../interfaces/Character';

interface CharacterFormData {
  name: string;
  race: string;
  characterClass: string;
  subclass?: string;
  level: string
  birthDate: string;
}

const CharacterCreate: React.FC = () => {
  const [form, setForm] = useState<CharacterFormData>({
    name: '',
    race: '',
    characterClass: '',
    subclass: '',
    level: '',
    birthDate: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validação básica (exemplo)
    if (!form.name || !form.race || !form.characterClass || !form.birthDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await authFetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate('/characters');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao criar personagem');
      }
    } catch (err) {
      console.error('Erro ao criar personagem', err);
    }
  };

  return (
    <>
      <Header />
      <div className="text-center">
        <FormWrapper title="Create New Character" onSubmit={handleSubmit}>
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Character Name"
          />

          <InputField
            label="Race"
            name="race"
            value={form.race}
            onChange={handleInputChange}
            placeholder="Race"
          />

          <InputField
            label="Class"
            name="characterClass"
            value={form.characterClass}
            onChange={handleInputChange}
            placeholder="Class"
          />

          <InputField
            label="Subclass (Optional)"
            name="subclass"
            value={form.subclass!}
            onChange={handleInputChange}
            placeholder="Subclass"
          />

          <InputField
            label="Level"
            name="level"
            value={form.level}
            onChange={handleInputChange}
            type="number"
            placeholder="Level"
          />

          <InputField
            label="Birth Date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleInputChange}
            placeholder="E.g 1st of Dawn of the 200th year"
          />

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton type="submit">Save</CommonButton>
            <CommonButton variant="secondary" onClick={() => navigate('/characters')}>
              Cancel
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default CharacterCreate;
