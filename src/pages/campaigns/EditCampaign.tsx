import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../../utils/authFetch';
import Header from '../../components/Header';
import InputField from '../../components/form/InputField.tsx';
import { ToggleButton, CommonButton } from '../../components/Buttons.tsx';
import FormWrapper from '../../components/form/FormWrapper.tsx';
import { spacing } from '../../styles/designSystem';

interface World {
  _id: string;
  name: string;
}

interface Arc {
  _id: string;
  name: string;
}

interface Character {
  _id: string;
  name: string;
}

interface Campaign {
  name: string;
  startDate: string;
  endDate?: string;
  world: string;
  arcs?: string[];
  characters?: string[];
}

const EditCampaign: React.FC = () => {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<Campaign>({
    name: '',
    startDate: '',
    endDate: '',
    world: '',
    arcs: [],
    characters: [],
  });

  const [originalForm, setOriginalForm] = useState<Campaign | null>(null);
  const [worldName, setWorldName] = useState<string>('');
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedArcIds, setSelectedArcIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignRes, worldsRes, arcsRes, charactersRes] = await Promise.all([
          authFetch(`/api/campaigns/${campaignId}`),
          authFetch('/api/worlds'),
          authFetch('/api/arcs'),
          authFetch('/api/characters'),
        ]);

        const campaignData = await campaignRes.json();
        const worldList: World[] = await worldsRes.json();

        const world = worldList.find((w) => w._id === campaignData.world._id);
        setWorldName(world?.name || '');

        const initialForm: Campaign = {
          name: campaignData.name,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate || '',
          world: campaignData.world._id,
          arcs: campaignData.arcs?.map((a: Arc) => a._id) || [],
          characters: campaignData.characters?.map((c: Character) => c._id) || [],
        };

        setForm(initialForm);
        setOriginalForm(initialForm);
        setSelectedArcIds(initialForm.arcs || []);
        setSelectedCharacterIds(initialForm.characters || []);
        setArcs(await arcsRes.json());
        setCharacters(await charactersRes.json());
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    };

    fetchData();
  }, [campaignId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleArcSelection = (id: string) => {
    setSelectedArcIds((prev) =>
      prev.includes(id) ? prev.filter((arcId) => arcId !== id) : [...prev, id]
    );
  };

  const toggleCharacterSelection = (id: string) => {
    setSelectedCharacterIds((prev) =>
      prev.includes(id) ? prev.filter((charId) => charId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updatedFields: Partial<Campaign> = {};

    if (form.endDate !== originalForm?.endDate) {
      if (form.endDate?.trim()) {
        updatedFields.endDate = form.endDate;
      } else {
        updatedFields.endDate = undefined;
      }
    }

    if (
      JSON.stringify(selectedArcIds.sort()) !== JSON.stringify((originalForm?.arcs || []).sort())
    ) {
      updatedFields.arcs = selectedArcIds;
    }

    if (
      JSON.stringify(selectedCharacterIds.sort()) !==
      JSON.stringify((originalForm?.characters || []).sort())
    ) {
      updatedFields.characters = selectedCharacterIds;
    }

    if (Object.keys(updatedFields).length === 0) return;

    try {
      const res = await authFetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        navigate('/campaigns');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Erro ao atualizar campanha');
      }
    } catch (err) {
      console.error('Erro ao enviar dados:', err);
    }
  };

  const hasChanges = () => {
    if (!originalForm) return false;

    return (
      form.endDate !== originalForm.endDate ||
      JSON.stringify(selectedArcIds.sort()) !== JSON.stringify((originalForm.arcs || []).sort()) ||
      JSON.stringify(selectedCharacterIds.sort()) !==
        JSON.stringify((originalForm.characters || []).sort())
    );
  };

  return (
    <>
      <Header />
      <FormWrapper title="Editar Campanha" onSubmit={handleSubmit}>
        <InputField
          label="Nome"
          name="name"
          value={form.name}
          onChange={handleChange}
          readOnly
        />

        <InputField
          label="Início"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          readOnly
        />

        <InputField
          label="Mundo"
          name="worldName"
          value={worldName}
          onChange={() => {}}
          readOnly
        />

        <InputField
          label="Fim"
          name="endDate"
          type="date"
          value={form.endDate ?? ''}
          onChange={handleChange}
        />

        <label className="block mt-4 mb-1 text-sm">Arcos</label>
        <div className="flex gap-2 mb-4 flex-wrap">
          {arcs.map((arc) => (
            <div key={arc._id}>
              <ToggleButton
                selected={selectedArcIds.includes(arc._id)}
                onClick={() => toggleArcSelection(arc._id)}
              >
                {arc.name}
              </ToggleButton>
            </div>
          ))}
        </div>

        <label className="block mt-4 mb-1 text-sm">Personagens</label>
        <div className="flex gap-2 mb-6 flex-wrap">
          {characters.map((char) => (
            <div key={char._id}>
              <ToggleButton
                selected={selectedCharacterIds.includes(char._id)}
                onClick={() => toggleCharacterSelection(char._id)}
              >
                {char.name}
              </ToggleButton>
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-8" style={{ paddingTop: spacing.lg }}>
          <CommonButton className={!hasChanges() ? 'opacity-50 cursor-not-allowed' : ''} type="submit">Salvar</CommonButton>
          <div>
            <CommonButton variant="secondary" onClick={() => navigate('/campaigns')}>
              Cancelar
            </CommonButton>
          </div>
        </div>
      </FormWrapper>
    </>
  );
};

export default EditCampaign;
