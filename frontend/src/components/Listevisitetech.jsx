import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getPolices, deletePolice } from '../services/policeservice';

const PolicePackageTable = () => {
  const [polices, setPolices] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getPolices().then(res => setPolices(res.data));
  };

  const handleEditClick = (police) => {
    navigate(`/modifier-police/${police.id}`, { state: { police } });
  };

  const handleDeleteClick = async (police) => {
    const confirm = window.confirm(`Supprimer la police ${police.num_police} ?`);
    if (confirm) {
      try {
        await deletePolice(police.id);
        alert('Police supprimée !');
        fetchData();
      } catch {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Contrats d'Assurance</Typography>

      <TableContainer>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Numéro Police</TableCell>
              <TableCell>Assureur</TableCell>
              <TableCell>Agence</TableCell>
              <TableCell>Véhicule</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Début</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Cotisation Totale</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Sinistre</TableCell>
              <TableCell>Remboursement</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {polices.map(police => (
              <TableRow key={police.id}>
                <TableCell>{police.num_police}</TableCell>
                <TableCell>{police.nom_ass}</TableCell>
                <TableCell>{police.nom_ag}</TableCell>
                <TableCell>{police.idveh}</TableCell>
                <TableCell>{police.type_assurance}</TableCell>
                <TableCell>{police.date_debut}</TableCell>
                <TableCell>{police.date_fin}</TableCell>
                <TableCell>{police.mtt_total} Ar</TableCell>
                <TableCell>{police.statut_pol}</TableCell>
                <TableCell>{police.description_sinistre || '—'}</TableCell>
                <TableCell>{police.montant_rembourse || '—'} Ar</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(police)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(police)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PolicePackageTable;

