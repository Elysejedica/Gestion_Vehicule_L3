import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getVehicules, deleteVehicule } from '../services/vehiculeservices';
import { getModeles } from '../services/modeleservices';
import { getKeycloakUsers } from '../services/localUserservices';
import { getCarburants } from '../services/carburantservices';
import { getMarques } from '../services/marqueservices';
import { getCategories } from '../services/categorieservices';
import { getCarosseries } from '../services/carosserieservices';
import ModifVehicule from './modifvehicule'; // ← Assure-toi que ce chemin est correct

const VehiculeTable = () => {
  const [vehicules, setVehicules] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [localUsers, setLocalUsers] = useState([]);
  const [carburants, setCarburants] = useState([]);
  const [marques, setMarques] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carosseries, setCarosseries] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getVehicules().then(res => setVehicules(res.data));
    getModeles().then(res => setModeles(res.data));
    getKeycloakUsers().then(res => setLocalUsers(res.data));
    getCarburants().then(res => setCarburants(res.data));
    getMarques().then(res => setMarques(res.data));
    getCategories().then(res => setCategories(res.data));
    getCarosseries().then(res => setCarosseries(res.data));
  };

  const getValue = (list, idKey, idValue, labelKey) => {
    const item = list.find(el => el[idKey] === idValue);
    return item ? item[labelKey] : "Non défini";
  };

  const handleEditClick = (vehicule) => {
    setSelectedVehicule(vehicule);
    setOpen(true);
  };

  const handleDeleteClick = async (vehicule) => {
    const confirmation = window.confirm(`Voulez-vous vraiment supprimer ce véhicule : ${vehicule.num_imm} ?`);
    if (confirmation) {
      try {
        await deleteVehicule(vehicule.num_imm);
        alert("✅ Véhicule supprimé !");
        fetchData();
      } catch (err) {
        alert("❌ Erreur lors de la suppression.");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicule(null);
    fetchData(); // recharge après modification
  };

  return (
    <Paper sx={{ padding: 2, marginLeft: 30 }}>
      <Typography variant="h6" gutterBottom>Liste Véhicules</Typography>

      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Immatriculation</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Marque</TableCell>
              <TableCell>Carburant</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Carrosserie</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicules.map((veh) => (
              <TableRow key={veh.num_imm}>
                <TableCell>{veh.num_imm}</TableCell>
                <TableCell>{getValue(modeles, 'idmod', veh.idmod, 'nom_mod')}</TableCell>
                <TableCell>{getValue(marques, 'idmar', veh.idmar, 'nom_mar')}</TableCell>
                <TableCell>{getValue(carburants, 'idcarb', veh.idcarb, 'type_carb')}</TableCell>
                <TableCell>{getValue(categories, 'idcat', veh.idcat, 'code_cat')}</TableCell>
                <TableCell>{getValue(carosseries, 'idcar', veh.idcar, 'code_car')}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditClick(veh)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(veh)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Fenêtre modale de modification */}
      {selectedVehicule && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>Modifier le véhicule</DialogTitle>
          <DialogContent>
            <ModifVehicule
              vehicule={selectedVehicule}
              modeles={modeles}
              marques={marques}
              carburants={carburants}
              categories={categories}
              carosseries={carosseries}
              localUsers={localUsers}
              setModeles={setModeles}
              setMarques={setMarques}
              setCategories={setCategories}
              setCarosseries={setCarosseries}
              setCarburants={setCarburants}
              onClose={handleClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  );
};

export default VehiculeTable;
