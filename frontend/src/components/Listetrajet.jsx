import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getTrajets, deleteTrajet } from '../services/trajetservice';

const TrajetTable = () => {
  const [trajets, setTrajets] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getTrajets().then(res => setTrajets(res.data));
  };

  const handleEditClick = (trajet) => {
    navigate(`/modifier-trajet/${trajet.idtraj}`, { state: { trajet } });
  };

  const handleDeleteClick = async (trajet) => {
    const confirm = window.confirm(`Supprimer le trajet ${trajet.idtraj} ?`);
    if (confirm) {
      try {
        await deleteTrajet(trajet.idtraj);
        alert('Trajet supprimé !');
        fetchData();
      } catch {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Liste des Trajets</Typography>

      <TableContainer>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>ID Véhicule</TableCell>
              <TableCell>Date Sortie</TableCell>
              <TableCell>Date Arrivée</TableCell>
              <TableCell>Heure Départ</TableCell>
              <TableCell>Heure Arrivée</TableCell>
              <TableCell>Point Départ</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Km Départ</TableCell>
              <TableCell>Km Arrivée</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Distance Cumulative</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trajets.map(trajet => (
              <TableRow key={trajet.idtraj}>
                <TableCell>{trajet.idveh}</TableCell>
                <TableCell>{trajet.date_sortie}</TableCell>
                <TableCell>{trajet.date_arriver}</TableCell>
                <TableCell>{trajet.heure_depart || '—'}</TableCell>
                <TableCell>{trajet.heure_arrivee || '—'}</TableCell>
                <TableCell>{trajet.point_depart || '—'}</TableCell>
                <TableCell>{trajet.destination}</TableCell>
                <TableCell>{trajet.kilometrage_depart}</TableCell>
                <TableCell>{trajet.kilometrage_arrivee}</TableCell>
                <TableCell>{trajet.distance}</TableCell>
                <TableCell>{trajet.distance_cumulative}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(trajet)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(trajet)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TrajetTable;

