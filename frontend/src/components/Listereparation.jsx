import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery, Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getReparations, deleteReparation } from '../services/reparationservice';

const ReparationTable = () => {
  const [reparations, setReparations] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getReparations().then(res => setReparations(res.data));
  };

  const handleEditClick = (reparation) => {
    navigate(`/modifier-reparation/${reparation.idrep}`, { state: { reparation } });
  };

  const handleDeleteClick = async (reparation) => {
    const confirm = window.confirm(`Supprimer la réparation ${reparation.idrep} ?`);
    if (confirm) {
      try {
        await deleteReparation(reparation.idrep);
        alert('Réparation supprimée !');
        fetchData();
      } catch {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Liste des Réparations</Typography>

      <TableContainer>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>ID Véhicule</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Garage</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Coût Main-d'œuvre</TableCell>
              <TableCell>Coût Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reparations.map(rep => (
              <TableRow key={rep.idrep}>
                <TableCell>{rep.idveh}</TableCell>
                <TableCell>{rep.date_reparation}</TableCell>
                <TableCell>{rep.type_repar}</TableCell>
                <TableCell>{rep.garge}</TableCell>
                <TableCell>{rep.description || '—'}</TableCell>
                <TableCell>{rep.cout_main_oeuvre} Ar</TableCell>
                <TableCell>{rep.cout_total} Ar</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(rep)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(rep)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReparationTable;
