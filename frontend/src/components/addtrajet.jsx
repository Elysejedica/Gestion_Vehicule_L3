import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Snackbar,
  Typography, FormControl, Box, Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import { Autocomplete } from '@mui/material';
import { createTrajet } from '../services/trajetservice';
import { getVehicules } from '../services/vehiculeservices';
import AddVidange from './addvidange';
import { envoyerEmailAlerte } from '../services/emailservice';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const AnimatedSection = ({ title, children, id }) => (
  <motion.div id={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  </motion.div>
);

const AddTrajet = () => {
  const [form, setForm] = useState({
    idveh: '',
    date_sortie: '',
    heure_depart: '',
    heure_arrivee: '',
    point_depart: '',
    destination: '',
    date_arriver:'',
    kilometrage_depart: '',
    kilometrage_arrivee: ''
  });

  const [vehicules, setVehicules] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [distanceHistorique, setDistanceHistorique] = useState({});
  const [alerteVidange, setAlerteVidange] = useState('');
  const [distance, setDistance] = useState(0);
  const [distanceCumulative, setDistanceCumulative] = useState(0);
  const [vidangeRequise, setVidangeRequise] = useState(false);
  const [vidangeEffectuee, setVidangeEffectuee] = useState(false);
  const [vidangeRequiseVehicules, setVidangeRequiseVehicules] = useState({});

  useEffect(() => {
    getVehicules().then(res => {
      setVehicules(res.data);
      const kmMap = {};
      const vidangeMap = {};
      res.data.forEach(v => {
        kmMap[v.idveh] = v.km_depuis_derniere_vidange || 0;
        vidangeMap[v.idveh] = v.vidange_requise || false;
      });
      setDistanceHistorique(kmMap);
      setVidangeRequiseVehicules(vidangeMap);
    });
  }, []);
const vehiculeChoisi = vehicules.find(v => v.idveh === form.idveh);
const proprietaireEmail = vehiculeChoisi?.proprietaire?.email;

  useEffect(() => {
    if (form.idveh) {
      const savedStatus = localStorage.getItem(`vidangeEffectuee_${form.idveh}`);
      setVidangeEffectuee(savedStatus === 'true');

      const cumulKm = distanceHistorique[form.idveh] || 0;
      const besoinVidange = cumulKm >= 5000 || vidangeRequiseVehicules[form.idveh];

      setVidangeRequise(besoinVidange);
      setDistanceCumulative(cumulKm);
      setAlerteVidange(besoinVidange ? `⚠️ ${cumulKm} km — Vidange requise !` : '');

      if (besoinVidange && savedStatus !== 'true') {
        setTimeout(() => {
          document.getElementById('vidange-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, [form.idveh, distanceHistorique]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'kilometrage_depart' || name === 'kilometrage_arrivee') {
      const kmDep = name === 'kilometrage_depart' ? value : form.kilometrage_depart;
      const kmArr = name === 'kilometrage_arrivee' ? value : form.kilometrage_arrivee;
      const calcDistance = Number(kmArr) - Number(kmDep);
      if (!isNaN(calcDistance)) {
        setDistance(calcDistance);
      }
    }
  };

  const handleVidangeEnregistree = () => {
    setVidangeEffectuee(true);
    setVidangeRequise(false);
    localStorage.setItem(`vidangeEffectuee_${form.idveh}`, 'true');
    setDistanceHistorique(prev => ({ ...prev, [form.idveh]: 0 }));
    setDistanceCumulative(0);
    showSnackbar("✅ Vidange enregistrée. Vous pouvez maintenant ajouter un trajet.");
    rechargerVehicules();
  };

  const rechargerVehicules = () => {
    getVehicules().then(res => {
      setVehicules(res.data);
      const kmMap = {};
      const vidangeMap = {};
      res.data.forEach(v => {
        kmMap[v.idveh] = v.km_depuis_derniere_vidange || 0;
        vidangeMap[v.idveh] = v.vidange_requise || false;
      });
      setDistanceHistorique(kmMap);
      setVidangeRequiseVehicules(vidangeMap);
    });
  };

  const showSnackbar = (msg, severity = 'success') => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    try {
      const response = await createTrajet(form);
      const vehiculeId = response.data.idveh;
      const km = distance;
      const totalKm = (distanceHistorique[vehiculeId] || 0) + km;

      if (totalKm >= 5000) {
        setAlerteVidange(`⚠️ ${totalKm} km — Vidange requise !`);
        setDistanceHistorique(prev => ({ ...prev, [vehiculeId]: 0 }));
        setDistanceCumulative(0);
        setVidangeRequise(true);
        setVidangeEffectuee(false);
        localStorage.setItem(`vidangeEffectuee_${vehiculeId}`, 'false');
        showSnackbar(`⚠️ Vidange requise pour ${vehiculeId}. Distance remise à zéro.`);
      } else {
        setDistanceHistorique(prev => ({ ...prev, [vehiculeId]: totalKm }));
        setDistanceCumulative(totalKm);
        setAlerteVidange('');
        showSnackbar(`✅ Trajet ajouté pour ${vehiculeId}. Total : ${totalKm} km`);
      }
       if (proprietaireEmail) {
        try {
          await envoyerEmailAlerte(form.idveh, proprietaireEmail);
          showSnackbar(`📩 Alerte vidange envoyée à ${proprietaireEmail}`);
        } catch (err) {
          console.error("Erreur envoi email :", err);
          showSnackbar("❌ Échec envoi email au propriétaire", "error");
        }
      }
    if (vidangeRequise && !vidangeEffectuee) {
      showSnackbar("❌ Vidange requise avant d'ajouter un trajet", "error");
      return;
    }
      setForm({
        idveh: '',
        date_sortie: '',
        heure_depart: '',
        heure_arrivee: '',
        point_depart: '',
        destination: '',
        date_arriver:'',
        kilometrage_depart: '',
        kilometrage_arrivee: ''
      });
      setDistance(0);
    } catch (err) {
      console.error("Erreur :", err);
      showSnackbar("❌ Échec ajout trajet", "error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, margin: 'auto' }}>
      <AnimatedSection title="Ajouter un trajet">
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={vehicules}
            getOptionLabel={(v) => v.num_imm}
            onChange={(e, value) =>
              setForm(prev => ({ ...prev, idveh: value?.idveh || '' }))
            }
            renderInput={(params) => <TextField {...params} label="Rechercher véhicule" fullWidth sx={{ mb: 2 }} />}
            isOptionEqualToValue={(opt, val) => opt.idveh === val.idveh}
          />
        </FormControl>

        {form.idveh && (
          <TextField
            label="Distance cumulée existante"
            value={distanceHistorique[form.idveh]?.toFixed(2) || '0.00'}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
        )}
         <TextField label="Point de départ" name="point_depart" fullWidth value={form.point_depart} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Destination" name="destination" fullWidth value={form.destination} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Date sortie" name="date_sortie" type="date" fullWidth value={form.date_sortie} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
         <TextField label="Heure départ" name="heure_depart" type="time" fullWidth value={form.heure_depart} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
        <TextField label="Km départ" name="kilometrage_depart" type="number" fullWidth value={form.kilometrage_depart} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Km arrivée" name="kilometrage_arrivee" type="number" fullWidth value={form.kilometrage_arrivee} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Date Arriver" name="date_arriver" type="date" fullWidth value={form.date_arriver} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
        <TextField label="Heure arrivée" name="heure_arrivee" type="time" fullWidth value={form.heure_arrivee} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />

        <TextField
          label="Distance du trajet"
          value={distance.toFixed(2)}
          fullWidth
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Distance cumulée totale"
          value={distanceCumulative.toFixed(2)}
          fullWidth
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
      </AnimatedSection>

      {vidangeRequise && !vidangeEffectuee && (
        <AnimatedSection title="🛠️ Vidange requise" id="vidange-section">
          <Typography variant="body1" sx={{ mb: 2 }}>
            Le véhicule a dépassé 5000 km. Veuillez effectuer une vidange pour continuer.
          </Typography>
          <AddVidange
            onVidangeEnregistree={handleVidangeEnregistree}
            vehiculeId={form.idveh}
          />
        </AnimatedSection>
      )}

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button type="submit" variant="contained" size="large" disabled={vidangeRequise && !vidangeEffectuee}>
          ➕ Ajouter Trajet
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

export default AddTrajet;
