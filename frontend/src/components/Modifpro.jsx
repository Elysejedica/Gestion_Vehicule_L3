import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Snackbar, Typography, Container, Box
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { updateProprietaire } from '../services/proprietaireservices';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ModifProprietaire = ({ proprietaire }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (proprietaire) setForm({ ...proprietaire });
  }, [proprietaire]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = form.nom && form.adresse && form.tel;
    if (!isValid) {
      showSnackbar("⚠️ Veuillez remplir les champs obligatoires.", "warning");
      return;
    }

    try {
      await updateProprietaire(form.idpro, form);
      showSnackbar("✅ Propriétaire modifié avec succès !");
      setTimeout(() => navigate('/Liste-pro'), 2000);
    } catch (error) {
      console.error("Erreur modification :", error);
      showSnackbar("❌ Échec de la modification.", "error");
    }
  };

  if (!form) return <Typography>⏳ Chargement des données du propriétaire...</Typography>;

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Modifier un propriétaire</Typography>

        <TextField fullWidth name="nom" label="Nom" value={form.nom || ''} onChange={handleChange} sx={{ mb: 2 }} required />
        <TextField fullWidth name="adresse" label="Adresse" value={form.adresse || ''} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth name="commune" label="Commune" value={form.commune || ''} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth name="profession" label="Profession" value={form.profession || ''} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth name="tel" label="Téléphone" value={form.tel || ''} onChange={handleChange} sx={{ mb: 2 }} required />
        <TextField fullWidth name="email" label="Email" value={form.email || ''} onChange={handleChange} sx={{ mb: 2 }} />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Sauvegarder les modifications</Button>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ModifProprietaire;


