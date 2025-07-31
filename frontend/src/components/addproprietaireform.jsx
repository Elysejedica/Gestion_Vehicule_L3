import React, { useState } from 'react';
import {
  TextField, Button, Snackbar, Typography, Box, Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';

import { createProprietaire } from '../services/proprietaireservices';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const AnimatedSection = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  </motion.div>
);

const AddProprietaire = ({ onProprioCreated }) => {
  const [form, setForm] = useState({
    nom: '', adresse: '', commune: '', profession: '', tel: '', email: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // reset error on change
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!form.adresse.trim()) newErrors.adresse = 'L’adresse est requise';
    if (!form.commune.trim()) newErrors.commune = 'La commune est requise';
    if (!form.profession.trim()) newErrors.profession = 'La profession est requise';

    if (!form.tel.trim()) {
      newErrors.tel = 'Le numéro de téléphone est requis';
    } else if (!/^\d{10}$/.test(form.tel)) {
      newErrors.tel = 'Le numéro doit contenir exactement 10 chiffres';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Adresse email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showSnackbar = (msg, severity = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await createProprietaire(form);
      showSnackbar("✅ Propriétaire ajouté avec succès");
      if (onProprioCreated) onProprioCreated(res.data);
      setForm({ nom: '', adresse: '', commune: '', profession: '', tel: '', email: '' });
    } catch (err) {
      console.error(err);
      showSnackbar("❌ Erreur lors de l'ajout", "error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto' }}>
      <AnimatedSection title="Ajouter un propriétaire">
        {[
          { name: 'nom', label: 'Nom' },
          { name: 'adresse', label: 'Adresse' },
          { name: 'commune', label: 'Commune' },
          { name: 'profession', label: 'Profession' },
          { name: 'tel', label: 'Téléphone', type: 'tel' },
          { name: 'email', label: 'Email', type: 'email' }
        ].map(({ name, label, type = 'text' }) => (
          <TextField
            key={name}
            name={name}
            label={label}
            type={type}
            fullWidth
            value={form[name]}
            onChange={handleChange}
            required={name !== 'email'}
            error={!!errors[name]}
            helperText={errors[name]}
            sx={{ mb: 2 }}
          />
        ))}
      </AnimatedSection>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button type="submit" variant="contained" size="large">
          📝 Enregistrer
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProprietaire;

