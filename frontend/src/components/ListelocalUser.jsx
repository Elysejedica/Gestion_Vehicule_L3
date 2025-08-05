import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getKeycloakUsers,deleteLocalUser } from '../services/localUserservices';

const LocalUserTable = () => {
  const [localUsers, setLocalUsers] = useState([]);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getKeycloakUsers().then(res => setLocalUsers(res.data));
  };

  const handleEditClick = (localUser) => {
    navigate(`/modifier/${localUser.idpro}`);
  };

  const handleDeleteClick = async (localUser) => {
    const confirmation = window.confirm(`Supprimer le propriétaire avec l'ID : ${localUser.idpro} ?`);
    if (confirmation) {
      try {
        await deleteLocalUser(localUser.idpro);
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
            {localUsers.map(localUser => (
              <TableRow key={localUser.idpro}>
                <TableCell>{localUser.nom}</TableCell>
                <TableCell>{localUser.adresse}</TableCell>
                <TableCell>{localUser.commune}</TableCell>
                <TableCell>{localUser.profession}</TableCell>
                <TableCell>{localUser.tel}</TableCell>
                <TableCell>{localUser.email || '—'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(localUser)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(localUser)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default LocalUserTable;

