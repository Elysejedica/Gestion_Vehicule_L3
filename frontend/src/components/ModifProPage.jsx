// 📄 pages/ModifProPage.jsx
import React from 'react';
import Modifpro from '../components/Modifpro';
import { useParams } from 'react-router-dom';
import { getLocalUser } from '../services/localUserservices';

const ModifProPage = () => {
  const { idpro } = useParams(); // récupère l'id depuis l'URL
  const [localUsers, setLocalUser] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const prop = await getLocalUser(idpro);
        console.log("Propriétaire :", prop);
        setLocalUser(prop?.data || prop);
      } catch (error) {
        console.error("Erreur lors du chargement du propriétaire :", error);
      }
    }
    fetchData();
  }, [idpro]);

  if (!localUsers) return <p>⏳ Chargement du propriétaire...</p>;

  return (
    <Modifpro localUsers={localUsers} />
  );
};

export default ModifProPage;

