import React, { useState, useEffect } from 'react';
import {
  TextField, Select, MenuItem, Button, Snackbar,
  FormControl, InputLabel, Typography, Box, Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';

import { createPiece, getPieces } from '../services/piecesservice';
import { createReparation } from '../services/reparationservice';
import { getVehicules } from '../services/vehiculeservices';
import { createDetailreparationservice } from '../services/detailreparationservice';


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

const AddPieceAndReparation = () => {
  const [pieceForm, setPieceForm] = useState({
    nom_piece: '', description: '', prix_unitaire: '', quantite_stock: ''
  });

  const [reparationForm, setReparationForm] = useState({
    idveh: '', date_reparation: '', description: '', cout_main_oeuvre: ''
  });

  const [detailReparationForm, setDetailReparationForm] = useState({
    idpiece: '', quantite: ''
  });

  const [pieces, setPieces] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [showPieceForm, setShowPieceForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    getPieces().then(res => setPieces(res.data));
    getVehicules().then(res => setVehicules(res.data));
  }, []);

  const refreshPieces = () => getPieces().then(res => setPieces(res.data));

  const handlePieceChange = e =>
    setPieceForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReparationChange = e =>
    setReparationForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDetailChange = e => {
    const { name, value } = e.target;
    setDetailReparationForm(prev => ({ ...prev, [name]: value }));
    if (name === 'idpiece' && value === 'autre') setShowPieceForm(true);
  };

  const showSnackbar = (msg, severity = 'success') =>
    setSnackbar({ open: true, message: msg, severity });

  const handlePieceSubmit = async e => {
    e.preventDefault();
    try {
      const res = await createPiece(pieceForm);
      showSnackbar('Pièce enregistrée');
      setShowPieceForm(false);
      setPieceForm({ nom_piece: '', description: '', prix_unitaire: '', quantite_stock: '' });
      refreshPieces();
      setDetailReparationForm(prev => ({ ...prev, idpiece: res.data.idpiece }));
    } catch {
      showSnackbar('Erreur enregistrement pièce', 'error');
    }
  };

  const handleReparationSubmit = async e => {
    e.preventDefault();
    try {
      const resRep = await createReparation(reparationForm);
      const { idrep, cout_total } = resRep.data;

      await createDetailreparationservice({
        reparation: idrep,
        piece: detailReparationForm.idpiece,
        quantite: detailReparationForm.quantite
      });

      showSnackbar(`🔧 Réparation enregistrée. Coût total : ${cout_total} €`);

      setReparationForm({
        idveh: '', date_reparation: '', description: '', cout_main_oeuvre: ''
      });
      setDetailReparationForm({ idpiece: '', quantite: '' });
    } catch (err) {
      console.error(err);
      showSnackbar('Erreur enregistrement réparation', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto' }}>
      <AnimatedSection title="🔧 Ajouter une réparation">
        <Box component="form" onSubmit={handleReparationSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Véhicule</InputLabel>
            <Select name="idveh" value={reparationForm.idveh} onChange={handleReparationChange} label="Véhicule">
              {vehicules.map(v => (
                <MenuItem key={v.idveh} value={v.idveh}>{v.num_imm}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Pièce</InputLabel>
            <Select name="idpiece" value={detailReparationForm.idpiece} onChange={handleDetailChange} label="Pièce">
              {pieces.map(p => (
                <MenuItem key={p.idpiece} value={p.idpiece}>{p.nom_piece}</MenuItem>
              ))}
              <MenuItem value="autre">Ajouter une nouvelle pièce</MenuItem>
            </Select>
          </FormControl>

          <TextField name="quantite" label="Quantité utilisée" type="number" fullWidth
            value={detailReparationForm.quantite} onChange={handleDetailChange} sx={{ mb: 2 }} />

          <TextField name="date_reparation" label="Date de réparation" type="date" fullWidth
            value={reparationForm.date_reparation} onChange={handleReparationChange}
            InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />

          <TextField name="description" label="Description" fullWidth
            value={reparationForm.description} onChange={handleReparationChange} sx={{ mb: 2 }} />

          <TextField name="cout_main_oeuvre" label="Coût main d’œuvre (€)" type="number" fullWidth
            value={reparationForm.cout_main_oeuvre} onChange={handleReparationChange} sx={{ mb: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Button type="submit" variant="contained" size="large">Ajouter réparation</Button>
          </Box>
        </Box>
      </AnimatedSection>

      {showPieceForm && (
        <AnimatedSection title="Ajouter une nouvelle pièce">
          <Box component="form" onSubmit={handlePieceSubmit}>
            <TextField label="Nom de la pièce" name="nom_piece" fullWidth onChange={handlePieceChange} value={pieceForm.nom_piece} sx={{ mb: 2 }} />
            <TextField label="Référence" name="description" fullWidth onChange={handlePieceChange} value={pieceForm.description} sx={{ mb: 2 }} />
            <TextField label="Prix unitaire (€)" name="prix_unitaire" type="number" fullWidth onChange={handlePieceChange} value={pieceForm.prix_unitaire} sx={{ mb: 2 }} />
            <TextField label="Quantité en stock" name="quantite_stock" type="number" fullWidth onChange={handlePieceChange} value={pieceForm.quantite_stock} sx={{ mb: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Button type="submit" variant="outlined" size="large">Enregistrer la pièce</Button>
            </Box>
          </Box>
        </AnimatedSection>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddPieceAndReparation;
