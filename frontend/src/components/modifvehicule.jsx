import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Snackbar, Typography, Box, Container, Grid, Autocomplete
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateVehicule } from '../services/vehiculeservices';


const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
const ModifVehicule = ({
  modeles: modelesProp = [],
  marques: marquesProp = [],
  carburants: carburantsProp = [],
  categories: categoriesProp = [],
  carosseries: carosseriesProp = [],
  proprietaires: proprietairesProp = [],
  createModele,
  createMarque,
  createCategorie,
  createCarosserie,
  createCarburant,
  createProprietaire,
  onClose
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicule = location.state?.vehicule;

  const [form, setForm] = useState(null);
  const [modeles, setModeles] = useState(modelesProp);
  const [marques, setMarques] = useState(marquesProp);
  const [categories, setCategories] = useState(categoriesProp);
  const [carosseries, setCarosseries] = useState(carosseriesProp);
  const [carburants, setCarburants] = useState(carburantsProp);
  const [proprietaires, setProprietaires] = useState(proprietairesProp);

  const [marquesFiltres, setMarquesFiltres] = useState([]);
  const [modelesFiltres, setModelesFiltres] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [comboSaisieEnCours, setComboSaisieEnCours] = useState("");
  const [nouvelleValeurCombo, setNouvelleValeurCombo] = useState("");

  useEffect(() => {
    if (vehicule) setForm({ idveh: vehicule.idveh, ...vehicule });
  }, [vehicule]);

 useEffect(() => {
    if (form?.idcat) {
      setMarquesFiltres(marques.filter(m => m.idcat === form.idcat));
    } else {
      setMarquesFiltres([]);
    }
  }, [form?.idcat, marques]);

  useEffect(() => {
    if (form?.idmar) {
      setModelesFiltres(modeles.filter(m => m.idmar === form.idmar));
    } else {
      setModelesFiltres([]);
    }
  }, [form?.idmar, modeles]);


  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      showSnackbar("❌ Fichier non valide.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === "num_imm" && !/^[A-Za-z0-9- ]{6,12}$/.test(value)) {
      alert("Le numéro d'immatriculation est invalide.");
    }

    if (name === "num_serie" && !/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) {
      alert("Le numéro de série (VIN) est invalide.");
    }

    if (name === "num_moteur" && !/^[A-Za-z0-9-]{5,20}$/.test(value)) {
      alert("Le numéro de moteur semble invalide.");
    }

    if (name === "poids_ch" || name === "poids_vide") {
      updatedForm.charge_utile = (parseFloat(updatedForm.poids_ch) || 0) - (parseFloat(updatedForm.poids_vide) || 0);
    }

    if (name === "date_emission") {
      const d1 = new Date(value);
      const d2 = new Date(form.date_immatriculation);
      const d3 = new Date(form.date_circulation);
      if (d1 && (d1 < d2 || d1 < d3)) {
        showSnackbar("❌ La date d'émission ne peut pas être antérieure aux autres dates.", "error");
        updatedForm.date_emission = "";
      }
    }

    setForm(updatedForm);
  };

  const handleAjouterCombo = async (createFn, setList, champ, idKey, labelKey) => {
    if (!nouvelleValeurCombo.trim()) return;
    try {
      const res = await createFn({ [labelKey]: nouvelleValeurCombo });
      const newItem = res.data;
      setList(prev => [newItem, ...prev]);
      setForm(prev => ({ ...prev, [champ]: newItem[idKey] }));
      setComboSaisieEnCours("");
      setNouvelleValeurCombo("");
      showSnackbar("✅ Valeur ajoutée !");
    } catch {
      showSnackbar("❌ Erreur lors de l’ajout", "error");
    }
  };

  const renderComboAvecAutre = (name, label, list, idKey, labelKey, createFn, setList) => (
    <Box key={name} sx={{ mb: 2 }}>
      <Autocomplete
        value={list.find(item => item[idKey] === form[name]) || null}
        onChange={(event, newValue) => {
          if (newValue === null) {
            setForm(prev => ({ ...prev, [name]: "" }));
          } else if (newValue === "autre") {
            setComboSaisieEnCours(name);
            setForm(prev => ({ ...prev, [name]: "" }));
          } else {
            setForm(prev => ({ ...prev, [name]: newValue[idKey] }));
            setComboSaisieEnCours("");
          }
        }}
        options={[...list, "autre"]}
        getOptionLabel={(option) => option === "autre" ? "Autre..." : option[labelKey]}
        renderInput={(params) => <TextField {...params} label={label} fullWidth />}
        isOptionEqualToValue={(option, value) => option?.[idKey] === value?.[idKey]}
      />

      {comboSaisieEnCours === name && (
        <>
          <TextField
            placeholder={`Nouvelle ${label.toLowerCase()}`}
            fullWidth
            value={nouvelleValeurCombo}
            onChange={(e) => setNouvelleValeurCombo(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleAjouterCombo(createFn, setList, name, idKey, labelKey)}> Ajouter </Button>
        </>
      )}
    </Box>
  );

  const labels = {
    num_imm: "Numéro d'immatriculation",
    num_serie: "Numéro de série",
    num_moteur: "Numéro de moteur",
    puissance: "Puissance (CV)",
    places: "Nombre de places",
    poids_ch: "Poids chargé (kg)",
    poids_vide: "Poids à vide (kg)",
    charge_utile: "Charge utile (kg)",
    cylindre: "Cylindrée",
    date_circulation: "Date de première circulation",
    date_immatriculation: "Date d'immatriculation",
    date_emission: "Date d'émission",
    annee: "Année de fabrication",
    type: "Type de véhicule"
  };

  if (!form) return <Typography>⏳ Données du véhicule non disponibles...</Typography>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVehicule(form.idveh, form);
      showSnackbar("✅ Véhicule modifié avec succès !");
      setTimeout(() => navigate('/'), 2000);
      if (onClose) onClose();
    } catch {
      showSnackbar("❌ Échec de la modification.", "error");
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, margin: 'auto', mb: 2 }}>
      <Typography variant="h5" gutterBottom>Modification</Typography>
      <Box sx={{ mb: 2 }}>
          <Autocomplete
            value={proprietaires.find(p => p.idpro === form.idpro) || null}
            onChange={(event, newValue) => {
              setForm(prev => ({ ...prev, idpro: newValue ? newValue.idpro : "" }));
            }}
            options={proprietaires}
            getOptionLabel={(option) => option.nom}
            renderInput={(params) => <TextField {...params} label="Propriétaire" fullWidth />}
            isOptionEqualToValue={(option, value) => option?.idpro === value?.idpro}
          />
        </Box>
       <Box sx={{ mt: 4 }}>
          {Object.entries(labels).map(([name, label]) => (
            <Box key={name} sx={{ mb: 2 }}>
              <TextField fullWidth name={name} label={label} value={form[name] || ''} onChange={handleChange} type={name.includes("date") ? "date" : "text"} InputLabelProps={name.includes("date") ? { shrink: true } : undefined}/>
            </Box>
          ))}
       <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button variant="outlined" component="label">
                Modifier l'image
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
              </Grid>
              <Grid item>
                {form.image && (
                  <img
                    src={form.image}
                    alt="Image du véhicule"
                    style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                  />
                )}
              </Grid>
            </Grid>
        </Box>
        <Box sx={{ mt: 4 }}>
          {renderComboAvecAutre("idcat", "Catégorie", categories, "idcat", "code_cat", createCategorie, setCategories)}
          {renderComboAvecAutre("idmar", "Marque", marquesFiltres, "idmar", "nom_mar", createMarque, setMarques)}
          {renderComboAvecAutre("idmod", "Modele", modelesFiltres, "idmod", "nom_mod", createModele, setModeles)}
          {renderComboAvecAutre("idcar", "Carrosserie", carosseries, "idcar", "code_car", createCarosserie, setCarosseries)}
          {renderComboAvecAutre("idcarb", "Carburant", carburants, "idcarb", "type_carb", createCarburant, setCarburants)}    
      </Box>

        <Button type="submit" variant="contained" sx={{ mt: 4 }}> Sauvegarder les modifications </Button>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          <Alert key={snackbar.message} severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
  </Box>
    </Container>
  );
};

export default ModifVehicule;
