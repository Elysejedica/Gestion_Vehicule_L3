import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Typography, IconButton, useMediaQuery, AppBar, Toolbar, Button, Menu, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssuranceIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Engineering';
import RouteIcon from '@mui/icons-material/AddRoad';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import HandymanIcon from '@mui/icons-material/Handyman';

const drawerWidth = 240;

const Layout = ({ children, handleLogout }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [vehiculeMenuAnchor, setVehiculeMenuAnchor] = useState(null);

  const handleVehiculeMenuOpen = (e) => setVehiculeMenuAnchor(e.currentTarget);
  const handleVehiculeMenuClose = () => setVehiculeMenuAnchor(null);

  const drawerContent = (
    <List>
      <Typography variant="h6" sx={{ padding: 2 }}>Gestion Véhicules</Typography>
      <Divider />
      <ListItem button component={Link} to="/add-assurance">
        <ListItemIcon><AssuranceIcon /></ListItemIcon>
        <ListItemText primary="Assurance" />
      </ListItem>
      <ListItem button component={Link} to="/add">
        <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
        <ListItemText primary="Ajout Véhicule" />
      </ListItem>
      <ListItem button component={Link} to="/add-proprietaire">
        <ListItemIcon><PersonIcon /></ListItemIcon>
        <ListItemText primary="Propriétaire" />
      </ListItem>
      <ListItem button component={Link} to="/add-centrevisite">
        <ListItemIcon><BuildIcon /></ListItemIcon>
        <ListItemText primary="Visite Technique" />
      </ListItem>
      <ListItem button component={Link} to="/add-trajet">
        <ListItemIcon><RouteIcon /></ListItemIcon>
        <ListItemText primary="Trajets" />
      </ListItem>
      <ListItem button component={Link} to="/add-vidange">
        <ListItemIcon><OilBarrelIcon /></ListItemIcon>
        <ListItemText primary="Vidanges" />
      </ListItem>
      <ListItem button component={Link} to="/add-ravitaillement">
        <ListItemIcon><LocalGasStationIcon /></ListItemIcon>
        <ListItemText primary="Ravitaillement" />
      </ListItem>
      <ListItem button component={Link} to="/add-reparation">
        <ListItemIcon><HandymanIcon /></ListItemIcon>
        <ListItemText primary="Réparation" />
      </ListItem>
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top navigation bar */}
      <AppBar position="fixed" sx={{ zIndex: 1301 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Gestion Véhicules</Typography>
          <Button color="inherit" onClick={handleLogout}>Se déconnecter</Button>
          <Button color="inherit" onClick={handleVehiculeMenuOpen}>Véhicule</Button>
          <Menu anchorEl={vehiculeMenuAnchor} open={Boolean(vehiculeMenuAnchor)} onClose={handleVehiculeMenuClose}>
            <MenuItem component={Link} to="/add" onClick={handleVehiculeMenuClose}>Ajout</MenuItem>
            <MenuItem component={Link} to="/" onClick={handleVehiculeMenuClose}>Liste</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 8, marginLeft: isMobile ? 0 : drawerWidth }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;