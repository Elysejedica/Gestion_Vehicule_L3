import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Snackbar, Typography, Box, Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { motion } from 'framer-motion';
import { createVehicule } from '../services/vehiculeservices';
import { getMarques, createMarque } from '../services/marqueservices';
import { getCategories, createCategorie } from '../services/categorieservices';
import { getModeles, createModele } from '../services/modeleservices';
import { getCarosseries, createCarosserie } from '../services/carosserieservices';
import { getCarburants, createCarburant } from '../services/carburantservices';
import { getProprietaires } from '../services/proprietaireservices';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const AnimatedSection = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  </motion.div>
);

const AddVehiculeForm = () => {
  const [form, setForm] = useState({ num_imm: '', idmod: '', idpro: '', idproNom: '', idcar: '', idcarb: '', idmar: '', idcat: '', num_serie: '', num_moteur: '', puissance: '', places: '',cylindre:'',image:'',poids_ch: '', poids_vide: '', charge_utile: '', date_circulation: '', date_immatriculation: '', date_emission: '', annee: '', type: '' });
  const [modeles, setModeles] = useState([]);
  const [modelesFiltrés, setModelesFiltrés] = useState([]);
  const [carburants, setCarburants] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [carrosseries, setCarrosseries] = useState([]);
  const [marques, setMarques] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProprietaires, setFilteredProprietaires] = useState([]);
  const [comboSaisieEnCours, setComboSaisieEnCours] = useState("");
  const [nouvelleValeurCombo, setNouvelleValeurCombo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
  image: "Photo du véhicule"
};
const placeholders = {
  num_imm: "Ex: 1234-AB",
  num_serie: "Ex: VF3CCHNZC12345678",
  num_moteur: "Ex: MOT-2024-789",
  puissance: "Ex: 75",
  places: "Ex: 5",
  poids_ch: "Ex: 1400",
  poids_vide: "Ex: 950",
  cylindre: "Ex: 1998 cm³",
  image: "Importer une photo du véhicule"
};


  useEffect(() => {
    getMarques().then(res => setMarques(res.data));
    getCategories().then(res => setCategories(res.data));
    getModeles().then(res => setModeles(res.data));
    getCarburants().then(res => setCarburants(res.data));
    getProprietaires().then(res => setProprietaires(res.data));
    getCarosseries().then(res => setCarrosseries(res.data));
  }, []);

  useEffect(() => {
    if (form.idmar) {
      setModelesFiltrés(modeles.filter(m => m.idmar === form.idmar));
    } else {
      setModelesFiltrés([]);
    }
  }, [form.idmar, modeles]);
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    // Envoie vers le backend pour sauvegarde
    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  }
};


  const handleChange = e => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

  if (name === "num_imm") {
    const regexImm = /^[A-Za-z0-9- ]{6,12}$/;

    if (!regexImm.test(value)) {
      alert("Le numéro d'immatriculation est invalide.");
    }
   }
  if (name === "num_serie") {
    const regexSerie = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!regexSerie.test(value)) {
      alert("Le numéro de série (VIN) est invalide. Il doit contenir 17 caractères alphanumériques.");
    }
  }
  if (name === "num_moteur") {
    const regexMoteur = /^[A-Za-z0-9-]{5,20}$/;
    if (!regexMoteur.test(value)) {
      alert("Le numéro de moteur semble invalide.");
    }
  }
    if (name === "poids_ch" || name === "poids_vide") {
      updatedForm.charge_utile = (parseFloat(updatedForm.poids_ch) || 0) - (parseFloat(updatedForm.poids_vide) || 0);
    }

    if (name === "date_emission") {
      const d1 = new Date(value), d2 = new Date(form.date_immatriculation), d3 = new Date(form.date_circulation);
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
      showSnackbar(" Valeur ajoutée !");
    } catch {
      showSnackbar(" Erreur lors de l’ajout", "error");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createVehicule(form);
      showSnackbar("Véhicule enregistré !");
    } catch {
      showSnackbar("Échec de l’enregistrement", "error");
    }
  };
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  //formulaire
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, margin: 'auto' }}>
 
      <Box sx={{ mb: 2 }}>
        <input accept="image/*" type="file" onChange={handleImageUpload} />
        {form.image && (
          <img src={form.image} alt="Aperçu" style={{ maxWidth: '100%', marginTop: 10 }} />
        )}
      </Box>

      <AnimatedSection title="Identification du véhicule">

        {Object.keys(labels).map(name => (
          <TextField  key={name} label={labels[name]} name={name} fullWidth value={form[name] || ""} onChange={handleChange} InputProps={name === "charge_utile" ? { readOnly: true } : {}} placeholder={placeholders[name]} sx={{ mb: 2 }}/>
        ))}
        {["date_circulation", "date_immatriculation", "date_emission"].map(dateField => (
          <TextField key={dateField} label={dateField.replace("date_", "Date ")} type="date" name={dateField} value={form[dateField]} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
        ))}
        <TextField label="Année" type="number" name="annee" value={form.annee || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        
        <Autocomplete
          options={["particulier", "professionnel"]}
          value={form.type || ""}
          onChange={(e, value) => setForm(prev => ({ ...prev, type: value }))}
          renderInput={(params) => <TextField {...params} label="Type" fullWidth sx={{ mb: 2 }} />}
        />
      </AnimatedSection>

      <AnimatedSection title="Propriétaire">
        <TextField label="Rechercher un propriétaire" name="idproNom" fullWidth value={form.idproNom}
          onChange={(e) => {
            const input = e.target.value.toLowerCase();
            setForm(prev => ({ ...prev, idproNom: input }));
            const suggestions = proprietaires.filter(p =>
              p.nom.toLowerCase().includes(input)
            );
            setFilteredProprietaires(suggestions);
          }}
          sx={{ mb: 2 }} />
        {filteredProprietaires.length > 0 && (
          <Paper sx={{ maxHeight: 150, overflow: 'auto', mb: 2 }}>
            {filteredProprietaires.map(p => (
              <Box key={p.idpro} sx={{ padding: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#eee' } }}
                onClick={() => {
                  setForm(prev => ({ ...prev, idpro: p.idpro, idproNom: p.nom }));
                  setFilteredProprietaires([]);
                }}
              >
                {p.nom}
              </Box>
            ))}
          </Paper>
        )}
      </AnimatedSection>

      <AnimatedSection title="Caractéristiques techniques">
      {[
                { name: "idcat", label: "Catégorie", list: categories, createFn: createCategorie, setList: setCategories, idKey: "idcat", labelKey: "code_cat" },
                { name: "idcar", label: "Carrosserie", list: carrosseries, createFn: createCarosserie, setList: setCarrosseries, idKey: "idcar", labelKey: "code_car" },
                { name: "idcarb", label: "Carburant", list: carburants, createFn: createCarburant, setList: setCarburants, idKey: "idcarb", labelKey: "type_carb" }
              
      ].map(({ name, label, list, createFn, setList, idKey, labelKey }) => (
      //cretion enregistrement depuis l'autre des idcat,idcar,idcarb
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
                getOptionLabel={option => option === "autre" ? "Autre..." : option[labelKey]}
                renderInput={(params) => <TextField {...params} label={label} />}
                isOptionEqualToValue={(option, value) => option?.[idKey] === value?.[idKey]}
        />
        {comboSaisieEnCours === name && (
        <>
          <TextField  placeholder={`Nouvelle ${label.toLowerCase()}`} fullWidth value={nouvelleValeurCombo} onChange={(e) => setNouvelleValeurCombo(e.target.value)} sx={{ mt: 1, mb: 1 }}/>
          <Button variant="outlined" onClick={() => handleAjouterCombo(createFn, setList, name, idKey, labelKey)}> Ajouter </Button>
        </>
        )}
      </Box>
        ))}

      {/* Bloc spécial pour le champ Modèle */}
        {form.idmod === "" && comboSaisieEnCours === "idmod" ? (
          <Box key="idmod" sx={{ mb: 2 }}>
            <Autocomplete
              options={marques} getOptionLabel={(option) => option.nom_mar} value={marques.find(m => m.idmar === form.idmar) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                      setForm(prev => ({ ...prev, idmar: newValue.idmar }));
                      }
                  }}
                    renderInput={(params) => (
                      <TextField {...params} label="Marque pour le nouveau modèle" placeholder="Sélectionner une marque" sx={{ mb: 1 }} />
                  )}
            />
            <TextField placeholder="Nom du nouveau modèle" fullWidth value={nouvelleValeurCombo} onChange={(e) => setNouvelleValeurCombo(e.target.value)} sx={{ mb: 1 }} />
            <Button variant="outlined" disabled={!nouvelleValeurCombo || !form.idmar}
                    onClick={async () => {
                      try {
                        const res = await createModele({
                          nom_mod: nouvelleValeurCombo,
                          idmar: form.idmar
                        });
                        const nouveauModele = res.data;
                        setModeles(prev => [nouveauModele, ...prev]);
                        setForm(prev => ({ ...prev, idmod: nouveauModele.idmod }));
                        setComboSaisieEnCours("");
                        setNouvelleValeurCombo("");
                        showSnackbar("✅ Modèle ajouté !");
                      } catch {
                        showSnackbar("❌ Erreur lors de l’ajout du modèle", "error");
                      }
                    }} > Ajouter </Button>
        </Box> ) : (
        <Box key="idmod" sx={{ mb: 2 }}>
          <Autocomplete
            value={modelesFiltrés.find(item => item.idmod === form.idmod) || null} onChange={(event, newValue) => {
                      if (newValue === "autre") {
                        setComboSaisieEnCours("idmod");
                        setForm(prev => ({ ...prev, idmod: "" }));
                      } else {
                        setForm(prev => ({ ...prev, idmod: newValue?.idmod || "" }));
                        setComboSaisieEnCours("");
                      }
                    }}
                    options={[...modelesFiltrés, "autre"]}
                    getOptionLabel={(option) =>
                      option === "autre" ? "Autre..." : option.nom_mod
                    }
                    renderInput={(params) => <TextField {...params} label="Modèle" />}
                    isOptionEqualToValue={(option, value) => option?.idmod === value?.idmod}
           />
        </Box> )}

        {/* Combo catégorie pour la nouvelle marque */}
        {form.idmar === "" && comboSaisieEnCours === "idmar" ? (
        <Box key="idmar" sx={{ mb: 2 }}>        
          <Autocomplete
              options={categories} getOptionLabel={(option) => option.code_cat} value={categories.find(c => c.idcat === form.idcat) || null}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setForm(prev => ({ ...prev, idcat: newValue.idcat }));
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Catégorie pour la nouvelle marque" placeholder="Sélectionner une catégorie" sx={{ mb: 1 }} />
                      )}
            />
            <TextField placeholder="Nom de la nouvelle marque" fullWidth value={nouvelleValeurCombo} onChange={(e) => setNouvelleValeurCombo(e.target.value)} sx={{ mb: 1 }} />
            <Button variant="outlined" disabled={!nouvelleValeurCombo || !form.idcat}onClick={async () => {
                        try {
                          const res = await createMarque({
                            nom_mar: nouvelleValeurCombo,
                            idcat: form.idcat
                          });
                          const nouvelleMarque = res.data;
                          setMarques(prev => [nouvelleMarque, ...prev]);
                          setForm(prev => ({ ...prev, idmar: nouvelleMarque.idmar }));
                          setComboSaisieEnCours("");
                          setNouvelleValeurCombo("");
                          showSnackbar("✅ Marque ajoutée !");
                        } catch {
                          showSnackbar("❌ Erreur lors de l’ajout de la marque", "error");
                        }
                      }} >Ajouter</Button>
            </Box>) : (
            <Box key="idmar" sx={{ mb: 2 }}>
              <Autocomplete
                value={marques.find(m => m.idmar === form.idmar) || null} onChange={(event, newValue) => {
                        if (newValue === "autre") {
                          setComboSaisieEnCours("idmar");
                          setForm(prev => ({ ...prev, idmar: "" }));
                        } else {
                          setForm(prev => ({ ...prev, idmar: newValue?.idmar || "" }));
                          setComboSaisieEnCours("");
                        }
                      }}
                      options={[...marques.filter(m => m.idcat === form.idcat), "autre"]}
                      getOptionLabel={(option) =>
                        option === "autre" ? "Autre..." : option.nom_mar
                      }
                      renderInput={(params) => <TextField {...params} label="Marque" />}
                      isOptionEqualToValue={(option, value) => option?.idmar === value?.idmar}
                    />
              </Box> )}
      </AnimatedSection>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button type="submit" variant="contained" size="large"> Enregistrer véhicule</Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} > {snackbar.message} </Alert>
      </Snackbar>
</Box>
  );
};

export default AddVehiculeForm;
