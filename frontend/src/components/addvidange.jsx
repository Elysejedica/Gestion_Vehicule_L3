import React, { useState, useEffect } from 'react';
import {
  TextField, Select, MenuItem, Button, Snackbar,
  Typography, FormControl, InputLabel, Box, Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';

import { createVidange } from '../services/vidangeservice';
import { getVehicules } from '../services/vehiculeservices';

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

const AddVidange = () => {
  const [form, setForm] = useState({
    idveh: '',
    date_vidange: '',
    type_huile: '',
    qtte_huile: '',
    prix_u_vidange: '',
    cout: ''
  });

  const [vehicules, setVehicules] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    getVehicules().then(res => setVehicules(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    const qtte = parseFloat(updated.qtte_huile);
    const prix = parseFloat(updated.prix_u_vidange);
    if (!isNaN(qtte) && !isNaN(prix)) updated.cout = (qtte * prix).toFixed(2);

    setForm(updated);
  };

const handleSubmit = async e => {
  e.preventDefault();

  console.log("Données à envoyer :", form);  // <= LOG ici

  try {
    await createVidange(form);
    showSnackbar("Vidange enregistrée !");
    setForm({
      idveh: '', date_vidange: '', type_huile: '',
      qtte_huile: '', prix_u_vidange: '', cout: ''
    });
  } catch (err) {
    console.error("Erreur API :", err.response?.data || err.message);
    showSnackbar("Erreur lors de l'ajout", "error");
  }
};

  const showSnackbar = (msg, severity = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, margin: 'auto' }}>
      <AnimatedSection title="Informations Vidange">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Véhicule</InputLabel>
          <Select name="idveh" value={form.idveh} onChange={handleChange} label="Véhicule">
            {vehicules.map(v => (
              <MenuItem key={v.idveh} value={v.idveh}>{v.num_imm}</MenuItem>
            ))}
          </Select>
        </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="type-huile">Type d'huile</InputLabel>
          <Select
            labelId="type-huile"
            name="type_huile"
            value={form.type_huile}
            label="Type d'huile"
            onChange={handleChange}
          >
            <MenuItem value=""><em>-- Sélectionner --</em></MenuItem>
            <MenuItem value="Huile moteur 5W30">Huile moteur 5W30</MenuItem>
            <MenuItem value="Huile moteur 10W40">Huile moteur 10W40</MenuItem>
            <MenuItem value="Huile synthétique">Huile synthétique</MenuItem>
            <MenuItem value="Huile semi-synthétique">Huile semi-synthétique</MenuItem>
            <MenuItem value="Huile transmission automatique">Huile transmission automatique</MenuItem>
            <MenuItem value="Huile transmission manuelle">Huile transmission manuelle</MenuItem>
            <MenuItem value="Huile hydraulique">Huile hydraulique</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Quantité d'huile (L)" name="qtte_huile" type="number" fullWidth value={form.qtte_huile} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Prix unitaire (€ / L)" name="prix_u_vidange" type="number" fullWidth value={form.prix_u_vidange} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Coût total (€)" name="cout" type="number" fullWidth value={form.cout} InputProps={{ readOnly: true }} sx={{ mb: 2, backgroundColor: '#f5f5f5' }} />
        <TextField label="Date de vidange" name="date_vidange" type="date" fullWidth value={form.date_vidange} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
      </AnimatedSection>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button type="submit" variant="contained" size="large">
          Ajouter Vidange
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

export default AddVidange;
