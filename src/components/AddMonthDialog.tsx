import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { CommonButton } from './Buttons.tsx';
import InputField from './form/InputField.tsx'; // assumindo esse caminho para seu input genérico
import { colors, fonts, borders, spacing } from '../styles/designSystem';

interface AddMonthDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (month: { name: string; days: number }) => void;
}

const AddMonthDialog: React.FC<AddMonthDialogProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [days, setDays] = useState('');

  const handleSave = () => {
    if (!name.trim() || !days || Number(days) <= 0) {
      alert('Preencha nome e número de dias corretamente');
      return;
    }
    onSave({ name: name.trim(), days: Number(days) });
    setName('');
    setDays('');
  };

  const handleClose = () => {
    setName('');
    setDays('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: colors.background,
          color: colors.foreground,
          border: borders.thick,
          fontFamily: fonts.main,
          padding: spacing.md,
        },
      }}
    >
      <div style={{ fontFamily: fonts.main, fontSize: '1.2rem', fontWeight: 'bold', margin: spacing.sm }}>
        Adicionar novo mês
      </div>

      <DialogContent dividers>
        <InputField
          label="Nome"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{paddingTop: spacing.xl}}>
          <InputField
            label="Número de dias"
            type="number"
            name="days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <CommonButton variant="danger" onClick={handleClose}>
          Cancelar
        </CommonButton>
        <CommonButton variant="primary" onClick={handleSave}>
          Salvar
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddMonthDialog;
