import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getProprietaires,deleteProprietaire } from '../services/proprietaireservices';

const ProprietaireTable = () => {
  const [proprietaires, setProprietaires] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getProprietaires().then(res => setProprietaires(res.data));
  };

  const handleEditClick = (proprietaire) => {
    navigate(`/modifier/${proprietaire.idpro}`);
  };

  const handleDeleteClick = async (proprietaire) => {
    const confirmation = window.confirm(`Supprimer le propriétaire avec l'ID : ${proprietaire.idpro} ?`);
    if (confirmation) {
      try {
        await deleteProprietaire(proprietaire.idpro);
        alert('Propriétaire supprimé !');
        fetchData();
      } catch {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>Liste des Propriétaires</Typography>

      <TableContainer>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Commune</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proprietaires.map(proprietaire => (
              <TableRow key={proprietaire.idpro}>
                <TableCell>{proprietaire.nom}</TableCell>
                <TableCell>{proprietaire.adresse}</TableCell>
                <TableCell>{proprietaire.commune}</TableCell>
                <TableCell>{proprietaire.profession}</TableCell>
                <TableCell>{proprietaire.tel}</TableCell>
                <TableCell>{proprietaire.email || '—'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(proprietaire)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(proprietaire)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProprietaireTable;

