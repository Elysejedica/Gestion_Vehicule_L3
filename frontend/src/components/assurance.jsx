import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import {
  TextField, Select, MenuItem, Button, Snackbar,
  FormControl, InputLabel, Typography, Box, Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import MuiAlert from '@mui/material/Alert';

import { getAssurances, createAssurance } from '../services/assuranceservice';
import { getAgences, createAgence } from '../services/agenceservice';
import { getVehicules } from '../services/vehiculeservices';
import { createPolice } from '../services/policeservice';
import { createSinistre } from '../services/sinistreservices';
import { createCotisation } from '../services/cotisationservice';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const AnimatedSection = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  </motion.div>
);

const AddFullPolicePackage = () => {
  const [assurances, setAssurances] = useState([]);
  const [agences, setAgences] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

const [form, setForm] = useState({
  idass: '', nom_ass: '', code_ass: '',
  idag: '', nom_ag: '', adresse: '',
  num_police: '', date_delivrance: '', date_debut: '', date_fin: '',
  type_assurance: '', statut_pol: '', idveh: '',
  mtt_cot: '', mtt_cp: '', mtt_de: '', mtt_ca: '', mtt_div: '',
  mtt_total: '', date_cot: '',
  date_debut_couverture: '', date_fin_couverture: '',
  statut_paiement: '', type_cotisation: '', date_sinistre: '',
  description_sinistre: '',
  montant_rembourse: ''
});


  const [selectedAssurance, setSelectedAssurance] = useState('');
  const [selectedAgence, setSelectedAgence] = useState('');

  useEffect(() => {
    getAssurances().then(res => setAssurances(res.data));
    getAgences().then(res => setAgences(res.data));
    getVehicules().then(res => setVehicules(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
      if (
      name === 'mtt_cot' ||
      name === 'mtt_cp' ||
      name === 'mtt_de' ||
      name === 'mtt_ca' ||
      name === 'mtt_div'
    ) {
      const total =
        parseFloat(updated.mtt_cot || 0) +
        parseFloat(updated.mtt_cp || 0) +
        parseFloat(updated.mtt_de || 0) +
        parseFloat(updated.mtt_ca || 0) +
        parseFloat(updated.mtt_div || 0);

      updated.mtt_total = total.toFixed(2);
    }

    setForm(updated);
  };



  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddAssurance = async () => {
    try {
      const res = await createAssurance({ nom_ass: form.nom_ass, code_ass: form.code_ass });
      const ajoutée = res.data;
      setAssurances(prev => [...prev, ajoutée]);
      setForm(prev => ({ ...prev, idass: ajoutée.idass }));
      setSelectedAssurance('');
      showSnackbar('Assurance ajoutée avec succès !');
    } catch {
      showSnackbar('Erreur ajout assurance', 'error');
    }
  };

  const handleAddAgence = async () => {
    try {
      const res = await createAgence({
        nom_ag: form.nom_ag, adresse: form.adresse, idass: form.idass
      });
      const ajoutée = res.data;
      setAgences(prev => [...prev, ajoutée]);
      setForm(prev => ({ ...prev, idag: ajoutée.idag }));
      setSelectedAgence('');
      showSnackbar('Agence ajoutée avec succès !');
    } catch {
      showSnackbar('Erreur ajout agence', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
//enregistrement agence
      let agenceId = form.idag;
      if (selectedAgence === 'autre') {
        const resAgence = await createAgence({
          nom_ag: form.nom_ag,
          adresse: form.adresse,
          idass: form.idass
        });
        agenceId = resAgence.data.idag;
      }
   

//enregistrement police
      const resPolice = await createPolice({
          num_police: form.num_police,
          date_delivrance: form.date_delivrance,
          date_debut: form.date_debut,
          date_fin: form.date_fin,
          statut_pol: form.statut_pol,
          type_assurance: form.type_assurance,
          idveh: form.idveh,
          idag: agenceId
        });
   // Enregistrement du sinistre (si les champs sont remplis)
      if (form.date_sinistre && form.description_sinistre && form.montant_rembourse) {
        await createSinistre({
          num_police: resPolice.data.num_police,
          date_sinistre: form.date_sinistre,
          description: form.description_sinistre,
          montant_rembourse: form.montant_rembourse
        });
        showSnackbar('Sinistre enregistré avec succès');
      }
//enregistrement cotisation    
    await createCotisation({
      num_police: resPolice.data.num_police,
      mtt_cot: form.mtt_cot,
      mtt_cp: form.mtt_cp,
      mtt_de: form.mtt_de,
      mtt_ca: form.mtt_ca,
      mtt_div: form.mtt_div,
      mtt_total: form.mtt_total,
      date_cot: form.date_cot,
      date_debut_couverture: form.date_debut_couverture,
      date_fin_couverture: form.date_fin_couverture,
      statut_paiement: form.statut_paiement,
      type_cotisation: form.type_cotisation
    });


      showSnackbar('Enregistrement complet réussi !');
    } catch (error) {
      console.error('Erreur complète :', error);
      showSnackbar('Échec de l’enregistrement', 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, margin: 'auto' }}>
         <AnimatedSection title="Assurance">
          <Autocomplete
        options={[...assurances, { idass: 'autre', nom_ass: 'Autre...', code_ass: '' }]}
        getOptionLabel={(option) =>
          option.nom_ass === 'Autre...' ? 'Autre...' : `${option.code_ass} : ${option.nom_ass}`
        }
        onChange={(e, value) => {
          if (value?.idass === 'autre') {
            setSelectedAssurance('autre');
          } else {
            setSelectedAssurance('');
            setForm(prev => ({ ...prev, idass: value?.idass || '' }));
          }
        }}
        renderInput={(params) => <TextField {...params} label="Rechercher ou choisir une assurance" fullWidth sx={{ mb: 2 }} />}
        isOptionEqualToValue={(opt, val) => opt.idass === val.idass}
      />

      {selectedAssurance === 'autre' && (
        <>
          <TextField label="Nom assurance" name="nom_ass" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
          <TextField label="Code assurance" name="code_ass" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
          <Button variant="contained" onClick={handleAddAssurance}> Ajouter assurance</Button>
        </>
      )}

      </AnimatedSection>
      
     <AnimatedSection title="Agence">
          <Autocomplete
            options={[...agences, { idag: 'autre', nom_ag: 'Autre...', adresse: '' }]}
            getOptionLabel={(option) =>
              option.nom_ag === 'Autre...' ? 'Autre...' : `${option.nom_ag} (${option.adresse})`
            }
            onChange={(e, value) => {
              if (value?.idag === 'autre') {
                setSelectedAgence('autre');
              } else {
                setSelectedAgence('');
                setForm(prev => ({ ...prev, idag: value?.idag || '' }));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Rechercher ou choisir une agence" fullWidth sx={{ mb: 2 }} />
            )}
            isOptionEqualToValue={(opt, val) => opt.idag === val.idag}
          />

          {selectedAgence === 'autre' && (
            <>
              <TextField
                label="Nom agence"
                name="nom_ag"
                fullWidth
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Adresse agence"
                name="adresse"
                fullWidth
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleAddAgence}>
                Ajouter agence
              </Button>
            </>
          )}
        </AnimatedSection>


      <AnimatedSection title=" Police">
        <TextField label="Numéro police" name="num_police" fullWidth onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Date délivrance" name="date_delivrance" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Date début" name="date_debut" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                <TextField label="Date fin" name="date_fin" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Statut de la police" name="statut_pol" fullWidth onChange={handleChange} sx={{ mb: 2 }} />

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
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type d'assurance</InputLabel>
            <Select name="type_assurance" value={form.type_assurance} onChange={handleChange} label="Type d'assurance">
              <MenuItem value="obligatoire">Obligatoire</MenuItem>
              <MenuItem value="tiers">Responsabilité civile</MenuItem>
              <MenuItem value="tous_risques">Tous risques</MenuItem>
            </Select>
        </FormControl>

      </AnimatedSection>
      <AnimatedSection title="Sinistre">
        <TextField
          label="Date du sinistre"
          name="date_sinistre"
          type="date"
          fullWidth
          value={form.date_sinistre}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description du sinistre"
          name="description_sinistre"
          fullWidth
          multiline
          rows={3}
          value={form.description_sinistre}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Montant remboursé (€)"
          name="montant_rembourse"
          type="number"
          fullWidth
          value={form.montant_rembourse}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </AnimatedSection>

      <AnimatedSection title="Cotisation">
        <TextField label="Montant cotisation" name="mtt_cot" fullWidth value={form.mtt_cot} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant couverture" name="mtt_cp" fullWidth value={form.mtt_cp} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant dommages" name="mtt_de" fullWidth value={form.mtt_de} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant catastrophe" name="mtt_ca" fullWidth value={form.mtt_ca} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant division" name="mtt_div" fullWidth value={form.mtt_div} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Montant total" name="mtt_total" fullWidth value={form.mtt_total} InputProps={{ readOnly: true }} sx={{ mb: 2, backgroundColor: '#f5f5f5' }} />
        <TextField label="Date cotisation" name="date_cot" type="date" fullWidth value={form.date_cot} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Date début couverture" name="date_debut_couverture" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Date fin couverture" name="date_fin_couverture" type="date" fullWidth onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Statut paiement</InputLabel>
          <Select name="statut_paiement" value={form.statut_paiement} onChange={handleChange} label="Statut paiement">
            <MenuItem value="payé">Payé</MenuItem>
            <MenuItem value="en attente">En attente</MenuItem>
            <MenuItem value="retard">Retard</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type cotisation</InputLabel>
          <Select name="type_cotisation" value={form.type_cotisation} onChange={handleChange} label="Type cotisation">
            <MenuItem value="mensuelle">Mensuelle</MenuItem>
            <MenuItem value="trimestrielle">Trimestrielle</MenuItem>
            <MenuItem value="annuelle">Annuelle</MenuItem>
          </Select>
        </FormControl>
      </AnimatedSection>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button variant="contained" size="large" type="submit">
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

export default AddFullPolicePackage;