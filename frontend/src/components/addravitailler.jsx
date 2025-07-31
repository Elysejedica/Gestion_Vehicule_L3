import React, { useState, useEffect } from 'react';
import {
  TextField, Select, MenuItem, Button, Snackbar,
  FormControl, InputLabel, Typography, Box, Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';

import { createRavitailleur } from '../services/ravitailleservice';
import { createStationservice, getStationservices } from '../services/stationservice';
import { getCarburants, createCarburant } from '../services/carburantservices';
import { getVehicules } from '../services/vehiculeservices';
import { Autocomplete } from '@mui/material';
const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const AnimatedSection = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  </motion.div>
);

const AddRavitailleur = () => {
  const [form, setForm] = useState({
    idveh: '', idcarb: '', idstation: '',
    date_ravitaillement: '', qtte_litre: '', prix_unitaire: '', montant: ''
  });

  const [vehicules, setVehicules] = useState([]);
  const [carburants, setCarburants] = useState([]);
  const [stations, setStations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [carburantSaisie, setCarburantSaisie] = useState(false);
  const [stationSaisie, setStationSaisie] = useState(false);
  const [carburantForm, setCarburantForm] = useState({ type_carb: '' });
  const [stationForm, setStationForm] = useState({ nom_station: '', localisation: '' });

  useEffect(() => {
    getVehicules().then(res => setVehicules(res.data));
    getCarburants().then(res => setCarburants(res.data));
    getStationservices().then(res => setStations(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    const qtte = parseFloat(updated.qtte_litre);
    const prix = parseFloat(updated.prix_unitaire);
    if (!isNaN(qtte) && !isNaN(prix)) updated.montant = (qtte * prix).toFixed(2);
    setForm(updated);
  };

  const handleAddCarburant = async () => {
    try {
      const res = await createCarburant(carburantForm);
      const nouveau = res.data;
      setCarburants(prev => [...prev, nouveau]);
      setForm(prev => ({ ...prev, idcarb: nouveau.idcarb }));
      setCarburantForm({ type_carb: '' });
      setCarburantSaisie(false);
      showSnackbar('Carburant ajouté !');
    } catch {
      showSnackbar('❌ Erreur carburant', 'error');
    }
  };

  const handleAddStation = async () => {
    try {
      const res = await createStationservice(stationForm);
      const nouvelle = res.data;
      setStations(prev => [...prev, nouvelle]);
      setForm(prev => ({ ...prev, idstation: nouvelle.idstation }));
      setStationForm({ nom_station: '', localisation: '' });
      setStationSaisie(false);
      showSnackbar(' Station ajoutée !');
    } catch {
      showSnackbar('❌ Erreur station', 'error');
    }
  };

  const showSnackbar = (msg, severity = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createRavitailleur(form);
      showSnackbar('✅ Ravitaillement enregistré avec succès');
    } catch {
      showSnackbar('🚨 Échec de l’enregistrement', 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, margin: 'auto' }}>
      <AnimatedSection title=" Véhicule">
        <FormControl fullWidth sx={{ mb: 2 }}>
        <Autocomplete
                    options={vehicules}
                    getOptionLabel={(v) => v.num_imm}
                    onChange={(e, value) =>
                      setForm(prev => ({ ...prev, idveh: value?.idveh || '' }))
                    }
                    renderInput={(params) => <TextField {...params} label="Rechercher véhicule (immatriculation)" fullWidth sx={{ mb: 2 }} />}
                    isOptionEqualToValue={(opt, val) => opt.idveh === val.idveh}
                  />
        </FormControl>
      </AnimatedSection>

      <AnimatedSection title=" Carburant">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type de carburant</InputLabel>
          <Select value={form.idcarb} onChange={e => {
            const val = e.target.value;
            if (val === 'autre') {
              setCarburantSaisie(true);
              setForm(prev => ({ ...prev, idcarb: '' }));
            } else {
              setCarburantSaisie(false);
              setForm(prev => ({ ...prev, idcarb: val }));
            }
          }} label="Type de carburant">
            {carburants.map(c => <MenuItem key={c.idcarb} value={c.idcarb}>{c.type_carb}</MenuItem>)}
            <MenuItem value="autre">Autre...</MenuItem>
          </Select>
        </FormControl>
        {carburantSaisie && (
          <>
            <TextField label="Type carburant" name="type_carb" fullWidth value={carburantForm.type_carb} onChange={e => setCarburantForm({ type_carb: e.target.value })} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleAddCarburant}>Ajouter carburant</Button>
          </>
        )}
      </AnimatedSection>

      <AnimatedSection title=" Détails">
        <TextField label="Quantité (litres)" name="qtte_litre" type="number" fullWidth value={form.qtte_litre} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Prix unitaire" name="prix_unitaire" type="number" fullWidth value={form.prix_unitaire} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant total" name="montant" type="number" fullWidth value={form.montant} InputProps={{ readOnly: true }} sx={{ mb: 2, backgroundColor: '#f5f5f5' }} />
        <TextField label="Date" name="date_ravitaillement" type="date" fullWidth value={form.date_ravitaillement} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
      </AnimatedSection>

      <AnimatedSection title=" Station-service">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Station</InputLabel>
          <Select value={form.idstation} onChange={e => {
            const val = e.target.value;
            if (val === 'autre') {
              setStationSaisie(true);
              setForm(prev => ({ ...prev, idstation: '' }));
            } else {
              setStationSaisie(false);
              setForm(prev => ({ ...prev, idstation: val }));
            }
          }} label="Station">
            {stations.map(s => <MenuItem key={s.idstation} value={s.idstation}>{s.nom_station} ({s.localisation})</MenuItem>)}
            <MenuItem value="autre">Autre...</MenuItem>
          </Select>
        </FormControl>
        {stationSaisie && (
          <>
            <TextField label="Nom station" name="nom_station" fullWidth value={stationForm.nom_station} onChange={e => setStationForm(prev => ({ ...prev, nom_station: e.target.value }))} sx={{ mb: 2 }} />
            <TextField label="Localisation" name="localisation" fullWidth value={stationForm.localisation} onChange={e => setStationForm(prev => ({ ...prev, localisation: e.target.value }))} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleAddStation}>Ajouter station</Button>
          </>
        )}
      </AnimatedSection>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button type="submit" variant="contained" size="large">✅ Enregistrer</Button>
      </Box>
        
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddRavitailleur;



