// 📄 pages/ModifProPage.jsx
import React from 'react';
import Modifpro from '../components/Modifpro';
import { useParams } from 'react-router-dom';
import { getProprietaire } from '../services/proprietaireservices';

const ModifProPage = () => {
  const { idpro } = useParams(); // récupère l'id depuis l'URL
  const [proprietaires, setProprietaire] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const prop = await getProprietaire(idpro);
        console.log("Propriétaire :", prop);
        setProprietaire(prop?.data || prop);
      } catch (error) {
        console.error("Erreur lors du chargement du propriétaire :", error);
      }
    }
    fetchData();
  }, [idpro]);

  if (!proprietaires) return <p>⏳ Chargement du propriétaire...</p>;

  return (
    <Modifpro proprietaires={proprietaires} />
  );
};

export default ModifProPage;

