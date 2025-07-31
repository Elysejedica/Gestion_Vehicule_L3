// pages/ModifVehiculePage.jsx
import React from 'react';
import ModifVehicule from '../components/modifvehicule';
import { getMarques} from '../services/marqueservices';
import { getCategories } from '../services/categorieservices';
import { getModeles } from '../services/modeleservices';
import { getCarosseries } from '../services/carosserieservices';
import { getCarburants} from '../services/carburantservices';
import { getProprietaires } from '../services/proprietaireservices';
import { useParams } from 'react-router-dom';
import { getVehicule} from '../services/vehiculeservices';

const ModifVehiculePage = () => {
  const { idveh } = useParams();
  const [vehicule, setVehicule] = React.useState(null);
  const [modeles, setModeles] = React.useState([]);
  const [marques, setMarques] = React.useState([]);
  const [carburants, setCarburants] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [carosseries, setCarosseries] = React.useState([]);
  const [proprietaires, setProprietaires] = React.useState([]);

 React.useEffect(() => {
  async function fetchData() {
    const v = await getVehicule(idveh);
    const mod = await getModeles();
    const mar = await getMarques();
    const carb = await getCarburants();
    const cat = await getCategories();
    const caross = await getCarosseries();
    const prop = await getProprietaires();

    console.log("Véhicule :", v);
    console.log("Modèles :", mod);
    console.log("Marques :", mar);
    console.log("Carburants :", carb);
    console.log("Catégories :", cat);
    console.log("Carosseries :", caross);
    console.log("Propriétaires :", prop);

    setVehicule(v);
    setModeles(mod?.data || mod); // selon ton API
    setMarques(mar?.data || mar);
    setCarburants(carb?.data || carb);
    setCategories(cat?.data || cat);
    setCarosseries(caross?.data || caross);
    setProprietaires(prop?.data || prop);
  }
  fetchData();
}, [idveh]);

  if (!vehicule) return <p>Chargement du véhicule...</p>;

  return (
    <ModifVehicule
      vehicule={vehicule}
      modeles={modeles} marques={marques}
      carburants={carburants} categories={categories}
      carosseries={carosseries} proprietaires={proprietaires}
      setModeles={setModeles} setMarques={setMarques}
      setCategories={setCategories} setCarosseries={setCarosseries}
      setCarburants={setCarburants}
    />
  );
};

export default ModifVehiculePage;
