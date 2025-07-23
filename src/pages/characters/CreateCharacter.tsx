import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import SelectField from '../../components/form/SelectField';
import FictionalDateSelect from '../../components/form/FictionalDateSelect';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';
import { authFetch } from '../../utils/authFetch';
import { World } from '../../interfaces/World';

interface CharacterFormData {
  name: string;
  race: string;
  characterClass: string;
  subclass?: string;
  level: string;
  birthDate: string;
  world: string;
}

const CharacterCreate: React.FC = () => {
  const [form, setForm] = useState<CharacterFormData>({
    name: '',
    race: '',
    characterClass: '',
    subclass: '',
    level: '',
    birthDate: '',
    world: '',
  });

  const [worlds, setWorlds] = useState<World[]>([]);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await authFetch('/api/worlds');
        if (response.ok) {
          const data = await response.json();
          setWorlds(data);
        } else {
          console.error('Erro ao buscar mundos');
        }
      } catch (err) {
        console.error('Erro ao buscar mundos', err);
      }
    };

    fetchWorlds();
  }, []);

  // Quando o mundo mudar, pegar calendar._id dele
  useEffect(() => {
    if (!form.world) {
      setCalendarId(null);
      return;
    }

    const fetchCalendarId = async () => {
      try {
        const response = await authFetch(`/api/worlds/${form.world}`);
        if (response.ok) {
          const data = await response.json();
          // Supondo que o objeto world tenha calendar com _id
          setCalendarId(data.calendar?._id ?? null);
        } else {
          console.error('Erro ao buscar world by id');
          setCalendarId(null);
        }
      } catch (err) {
        console.error('Erro ao buscar world by id', err);
        setCalendarId(null);
      }
    };

    fetchCalendarId();
  }, [form.world]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.race || !form.characterClass || !form.birthDate || !form.world) {
      alert('Please fill in all required fields, including world.');
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
            label="Level"
            name="level"
            value={form.level}
            onChange={handleInputChange}
            type="number"
            placeholder="Level"
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

          <SelectField
            label="World"
            name="world"
            value={form.world}
            onChange={handleSelectChange}
            options={worlds.map((world) => ({
              value: world._id,
              label: world.name,
            }))}
            placeholder="Select a world"
          />

          <FictionalDateSelect
            label="Birth Date"
            name="birthDate"
            value={form.birthDate}
            onChange={(val) =>
              setForm((prev) => ({
                ...prev,
                birthDate: val,
              }))
            }
            calendarId={calendarId ?? ''}
            disabled={!calendarId}
          />
          <div className='text-xs mt-2'>
          {form.birthDate}
          </div>

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
