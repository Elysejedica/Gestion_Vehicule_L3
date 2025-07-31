import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getVidanges, deleteVidange } from '../services/vidangeservice';

const VidangeTable = () => {
  const [vidanges, setVidanges] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getVidanges().then(res => setVidanges(res.data));
  };

  const handleEditClick = (vidange) => {
    navigate(`/modifier-vidange/${vidange.idvid}`, { state: { vidange } });
  };

  const handleDeleteClick = async (vidange) => {
    const confirm = window.confirm(`Supprimer la vidange du véhicule ${vidange.idveh} ?`);
    if (confirm) {
      try {
        await deleteVidange(vidange.idvid);
        alert('Vidange supprimée !');
        fetchData();
      } catch {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Liste des Vidanges</Typography>

      <TableContainer>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Véhicule</TableCell>
              <TableCell>Date Vidange</TableCell>
              <TableCell>Type d’huile</TableCell>
              <TableCell>Quantité (L)</TableCell>
              <TableCell>Prix Unitaire (Ar)</TableCell>
              <TableCell>Coût Total (Ar)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vidanges.map(v => (
              <TableRow key={v.idvid}>
                <TableCell>{v.idveh}</TableCell>
                <TableCell>{v.date_vidange}</TableCell>
                <TableCell>{v.type_huile}</TableCell>
                <TableCell>{v.qtte_huile}</TableCell>
                <TableCell>{v.prix_u_vidange}</TableCell>
                <TableCell>{(v.qtte_huile * v.prix_u_vidange).toFixed(2)} Ar</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(v)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(v)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default VidangeTable;

