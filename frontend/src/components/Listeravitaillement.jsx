import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getRavitaillers, deleteRavitailleur} from '../services/ravitailleservice';


const RavitaillerTable = () => {
  const [ravitaillers, setRavitaillements] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getRavitaillers().then(res => setRavitaillements(res.data));
  };

  const handleEditClick = (ravitaillers) => {
    navigate(`/modifier-ravitaillement/${ravitaillers.id}`, { state: { ravitaillers } });
  };

  const handleDeleteClick = async (ravitaillers) => {
    const confirm = window.confirm(`Supprimer le ravitaillement pour le véhicule ${ravitaillers.idveh} ?`);
    if (confirm) {
      try {
        await deleteRavitailleur(ravitaillers.id);
        alert('Ravitaillement supprimé !');
        fetchData();
      } catch {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Liste des Ravitaillements</Typography>

      <TableContainer>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>ID Véhicule</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>Carburant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantité (L)</TableCell>
              <TableCell>Prix Unitaire</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ravitaillers.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.idveh}</TableCell>
                <TableCell>{r.idstation}</TableCell>
                <TableCell>{r.idcarb}</TableCell>
                <TableCell>{r.date_ravitaillement}</TableCell>
                <TableCell>{r.qtte_litre}</TableCell>
                <TableCell>{r.prix_unitaire}</TableCell>
                <TableCell>{r.montant}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(r)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(r)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RavitaillerTable;
