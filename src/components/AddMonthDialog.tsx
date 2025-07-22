import React, { useState, useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { CommonButton } from './Buttons';
import InputField from './form/InputField'; // assumindo esse caminho para seu input genérico
import { colors, fonts, borders, spacing } from '../styles/designSystem';

interface AddMonthDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (month: { name: string; days: number }) => void;
}

const AddMonthDialog: React.FC<AddMonthDialogProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [days, setDays] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  if (open && nameInputRef.current) {
    nameInputRef.current.focus();
  }
}, [open]);

  const handleSave = () => {
    if (!name.trim() || !days || Number(days) <= 0) {
      alert('Error in fields');
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
        Add new month
      </div>

      <DialogContent dividers>
        <InputField
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputRef={nameInputRef}
        />
        <InputField
          label="Number of days"
          type="number"
          name="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <CommonButton variant="primary" onClick={handleSave}>
          Save
        </CommonButton>
        <CommonButton variant="secondary" onClick={handleClose}>
          Cancel
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddMonthDialog;
