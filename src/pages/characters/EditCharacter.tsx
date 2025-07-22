import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';
import Header from '../../components/ui/Header';
import InputField from '../../components/form/InputField';
import { CommonButton } from '../../components/ui/Buttons';
import FormWrapper from '../../components/form/FormWrapper';
import { spacing } from '../../styles/designSystem';

interface Character {
  _id: string;
  name: string;
  race: string;
  characterClass: string;
  subclass?: string;
  level: string;
  birthDate: string;
}

const EditCharacter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Character | null>(null);
  const [originalForm, setOriginalForm] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;
      try {
        const res = await authFetch(`/api/characters/${id}`);
        if (!res.ok) throw new Error('Failed to fetch character');
        const data: Character = await res.json();
        setForm(data);
        setOriginalForm(data);
      } catch (err) {
        console.error('Error loading character:', err);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;

    const { name, value } = e.target;

    // Para level, converte para number
    setForm({
      ...form,
      [name]: name === 'level' ? Number(value) : value,
    });
  };

  const hasChanges = () => {
    if (!form || !originalForm) return false;

    // Só verificamos os campos editáveis (subclass e level)
    return (
      (form.subclass ?? '') !== (originalForm.subclass ?? '') ||
      form.level !== originalForm.level
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;

    if (!hasChanges()) return; // Nada mudou, não salva

    // Construir objeto só com os campos editáveis que mudaram
    const updatedFields: Partial<Character> = {};
    if ((form.subclass ?? '') !== (originalForm?.subclass ?? '')) {
      updatedFields.subclass = form.subclass;
    }
    if (form.level !== originalForm?.level) {
      updatedFields.level = form.level;
    }

    try {
      const res = await authFetch(`/api/characters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        navigate('/characters');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Erro ao atualizar personagem');
      }
    } catch (err) {
      console.error('Erro ao atualizar personagem:', err);
    }
  };

  if (!form) return <div className="p-4">Loading character data...</div>;

  return (
    <>
      <Header />
      <div className="text-center">
        <FormWrapper title="Edit Character" onSubmit={handleSubmit}>
          {/* Campos readonly */}
          <InputField
            label="Name"
            name="name"
            value={form.name}
            readOnly
            onChange={() => {}}
          />
          <InputField
            label="Birth Date"
            name="birthDate"
            value={form.birthDate}
            readOnly
            onChange={() => {}}
          />
          <InputField
            label="Race"
            name="race"
            value={form.race}
            readOnly
            onChange={() => {}}
          />
          <InputField
            label="Class"
            name="characterClass"
            value={form.characterClass}
            readOnly
            onChange={() => {}}
          />

          {/* Campos editáveis */}
          <InputField
            label="Subclass (Optional)"
            name="subclass"
            value={form.subclass || ''}
            onChange={handleChange}
            placeholder="Subclass"
          />
          <InputField
            label="Level"
            name="level"
            type="number"
            value={form.level}
            onChange={handleChange}
          />

          <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
            <CommonButton
              type="submit"
              className={!hasChanges() ? 'opacity-50 cursor-not-allowed' : ''}
              disabled={!hasChanges()}
            >
              Save
            </CommonButton>
            <CommonButton variant="secondary" onClick={() => navigate('/characters')}>
              Cancel
            </CommonButton>
          </div>
        </FormWrapper>
      </div>
    </>
  );
};

export default EditCharacter;
