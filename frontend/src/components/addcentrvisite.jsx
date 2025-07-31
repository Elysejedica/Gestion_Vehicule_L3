import React, { useState, useEffect } from 'react';
import {
  TextField, Select, MenuItem, Button,
  FormControl, InputLabel, Snackbar, Alert,
  Box, Typography, Paper
} from '@mui/material';
import { motion } from 'framer-motion';

import {
  createCentrevisite, getCentresvisites
} from '../services/centrevisiteservice';
import { createOperateur } from '../services/operateurservice';
import { createControle } from '../services/controletechservice';
import { createCarteviolette } from '../services/carteviolservice';
import { createRecuControle } from '../services/recucontservice';
import { getVehicules } from '../services/vehiculeservices';

const AnimatedSection = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  </motion.div>
);

const AddFullControlePackageWithRecu = () => {
const [form, setForm] = useState({
  idcentre: '', nom_centre: '', adresse: '', nom_oper: '', idveh: '',
  date_visite: '', date_valid: '', pv_num: '', aptitude: '', date_delivrance_c: '',
  num_carte: '', date_delivrance: '', num_rec: '', date_rec: '',
  mtt_droit: '', mtt_pv: '', mtt_carte: '', mtt_tva: '', mtt_tht: '', mtt_total: '',
  frequence_mois: '12' // valeur par défaut
});

  const [centres, setCentres] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    getCentresvisites().then(res => setCentres(res.data));
    getVehicules().then(res => setVehicules(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    const droit = parseFloat(updated.mtt_droit || 0);
    const pv = parseFloat(updated.mtt_pv || 0);
    const carte = parseFloat(updated.mtt_carte || 0);
    const tva = droit + pv + carte;
    const tht = tva * 0.2;
    const total = tva + tht;

    updated.mtt_tva = tva.toFixed(2);
    updated.mtt_tht = tht.toFixed(2);
    updated.mtt_total = total.toFixed(2);

    setForm(updated);
  };

  const handleCentreSelect = e => {
    const value = e.target.value;
    if (value === 'autre') {
      setSelectedCentre('autre');
    } else {
      setSelectedCentre('');
      setForm(prev => ({ ...prev, idcentre: value }));
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddCentre = async () => {
    try {
      const res = await createCentrevisite({
        nom_centre: form.nom_centre,
        adresse: form.adresse
      });
      const newCentre = res.data;
      setCentres(prev => [...prev, newCentre]);
      setForm(prev => ({ ...prev, idcentre: newCentre.idcentre }));
      setSelectedCentre('');
      showSnackbar('Centre ajouté avec succès !');
    } catch {
      showSnackbar('Erreur ajout centre', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let idcentre = form.idcentre;
      if (selectedCentre === 'autre') {
      //enregistrement du nouveau centre de visite
        const resCentre = await createCentrevisite({
          nom_centre: form.nom_centre,
          adresse: form.adresse
        });
        idcentre = resCentre.data.idcentre;
      }

      //enregistrement de l'opérateur
      const resOperateur = await createOperateur({
        nom_oper: form.nom_oper,
        idcentre: idcentre
      });
      const idoper = resOperateur.data.idoper;

      //enregistrement du contrôle technique
      const resControle = await createControle({
        idveh: form.idveh,
        idoper: idoper,
        date_visite: form.date_visite,
        date_valid: form.date_valid,
        pv_num: form.pv_num,
        aptitude: form.aptitude,
        date_delivrance_c: form.date_delivrance_c,
        frequence_mois: form.frequence_mois
      });

      const { idcont, prochaine_visite, est_valide } = resControle.data;

      showSnackbar(` Contrôle enregistré. Prochaine visite : ${prochaine_visite}`);

      if (!est_valide) {
        setTimeout(() => {
          showSnackbar('Le contrôle est expiré !', 'warning');
        }, 4000);
      }

      //enregistrement de la carte violette et du reçu de contrôle
      await createCarteviolette({
        idcont: idcont,
        num_carte: form.num_carte,
        date_delivrance: form.date_delivrance
      });

      //enregistrement du reçu de contrôle
      await createRecuControle({
        idcont: idcont,
        num_rec: form.num_rec,
        date_rec: form.date_rec,
        mtt_droit: form.mtt_droit,
        mtt_pv: form.mtt_pv,
        mtt_carte: form.mtt_carte,
        mtt_tva: form.mtt_tva,
        mtt_tht: form.mtt_tht,
        mtt_total: form.mtt_total
      });

      showSnackbar('Enregistrement complet réussi !');
    } catch (error) {
      console.error(error);
      showSnackbar('Une erreur est survenue. Voir console.', 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, margin: 'auto' }}>

       <AnimatedSection title="Carte violette">
        <TextField label="Numéro carte" name="num_carte" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
                <TextField
          label="Date délivrance carte"
          name="date_delivrance"
          type="date"
          fullWidth
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
      </AnimatedSection>
      
      <AnimatedSection title="Centre de visite">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Centre</InputLabel>
          <Select value={form.idcentre} onChange={handleCentreSelect} label="Centre">
            {centres.map(c => (
              <MenuItem key={c.idcentre} value={c.idcentre}>
                {c.nom_centre} — {c.adresse}
              </MenuItem>
            ))}
            <MenuItem value="autre">Autre...</MenuItem>
          </Select>
        </FormControl>
        {selectedCentre === 'autre' && (
          <>
            <TextField label="Nom du centre" name="nom_centre" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
            <TextField label="Adresse du centre" name="adresse" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleAddCentre}>Ajouter centre</Button>
          </>
        )}
      </AnimatedSection>

      <AnimatedSection title="Opérateur">
        <TextField label="Nom de l’opérateur" name="nom_oper" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
      </AnimatedSection>

      <AnimatedSection title="Contrôle technique">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Véhicule</InputLabel>
          <Select name="idveh" value={form.idveh} onChange={handleChange} label="Véhicule">
            {vehicules.map(v => (
              <MenuItem key={v.idveh} value={v.idveh}>{v.num_imm}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Date visite" name="date_visite" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Date validité" name="date_valid" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Numéro PV" name="pv_num" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Aptitude" name="aptitude" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Date délivrance contrôle" name="date_delivrance_c" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Fréquence (mois)" name="frequence_mois" type="number" fullWidth value={form.frequence_mois} onChange={handleChange} sx={{ mb: 2 }} />
      </AnimatedSection>

      <AnimatedSection title="Reçu de contrôle">
        <TextField label="Numéro reçu" name="num_rec" fullWidth value={form.num_rec} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Date reçu" name="date_rec" type="date" fullWidth value={form.date_rec} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />

        <TextField label="Montant droit" name="mtt_droit" fullWidth value={form.mtt_droit} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant PV" name="mtt_pv" fullWidth value={form.mtt_pv} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant carte" name="mtt_carte" fullWidth value={form.mtt_carte} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant TVA" name="mtt_tva" fullWidth value={form.mtt_tva} InputProps={{ readOnly: true }} sx={{ mb: 2, backgroundColor: '#f5f5f5' }} />
        <TextField label="Montant HT" name="mtt_tht" fullWidth value={form.mtt_tht} InputProps={{ readOnly: true }} sx={{ mb: 2, backgroundColor: '#f5f5f5' }} />
        <TextField label="Montant total" name="mtt_total" fullWidth value={form.mtt_total} InputProps={{ readOnly: true }} sx={{ mb: 2, backgroundColor: '#f5f5f5' }} />
      </AnimatedSection>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button variant="contained" type="submit" size="large">
          Enregistrer tout
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddFullControlePackageWithRecu;

