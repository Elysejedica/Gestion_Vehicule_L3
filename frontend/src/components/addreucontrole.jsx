import React, { useState, useEffect } from 'react';
import { createRecuControle } from '../services/recucontservice';
import { getControles  } from '../services/controletechservice';

const AddRecuControles = () => {
  const [form, setForm] = useState({
     idcont: '',
     date_rec: '',
     num_rec: '',
     mtt_droit: '',
     mtt_pv: '',
     mtt_carte: '',
     mtt_tht: '',
     mtt_tva: '',
     mtt_total: ''
  });
  const [controles, setControles] = useState([]);

  useEffect(() => {
    getControles ().then(res => setControles(res.data));
  }, []);

const handleChange = e => {
  const { name, value } = e.target;

  const updatedForm = { ...form, [name]: value };

  // Conversion sécurisée
  const mtt_droit = parseFloat(updatedForm.mtt_droit || 0);
  const mtt_pv = parseFloat(updatedForm.mtt_pv || 0);
  const mtt_carte = parseFloat(updatedForm.mtt_carte || 0);

  // Calculs
  const mtt_tva = mtt_droit + mtt_pv + mtt_carte;
  const mtt_tht = mtt_tva * 0.2;
  const mtt_total = mtt_tva + mtt_tht;

  setForm({
    ...updatedForm,
    mtt_tva: mtt_tva.toFixed(2),
    mtt_tht: mtt_tht.toFixed(2),
    mtt_total: mtt_total.toFixed(2)
  });
};


  const handleSubmit = e => {
    e.preventDefault();
    createRecuControle(form)
      .then(() => alert('Reçu de contrôle enregistré'))
      .catch(err => {
        console.error("Erreur d'enregistrement :", err);
        if (err.response) {
          console.log("Réponse serveur :", err.response.data);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
    <input name="num_rec" placeholder="Numéro de reçu" value={form.num_rec} onChange={handleChange} required />
      <select name="idcont" value={form.idcont} onChange={handleChange}>
        <option value="">Sélectionner une police</option>
        {controles.map(c => (
          <option key={c.id} value={c.id}>{c.id}</option>
        ))}
      </select>

      <input name="mtt_droit" placeholder="Montant droit" value={form.mtt_droit} onChange={handleChange} />
      <input name="mtt_pv" placeholder="Montant PV" value={form.mtt_pv} onChange={handleChange} />
      <input name="mtt_carte" placeholder="Montant carte" value={form.mtt_carte} onChange={handleChange} />
      <input name="mtt_tht" placeholder="Montant HT" value={form.mtt_tht} onChange={handleChange} />
      <input name="mtt_tva" placeholder="Montant TVA" value={form.mtt_tva} onChange={handleChange} />
      <input name="mtt_total" placeholder="Montant total" value={form.mtt_total} readOnly style={{ backgroundColor: '#eee' }} />

      <input name="date_rec" type="date" value={form.date_rec} onChange={handleChange} />

      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddRecuControles;
