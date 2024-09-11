import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './detailStyle.css'

const DetailCommande = () => {
  const [updateStatu, setUpdateStatu] = useState('')
  // State for the form fields
  const [commande, setCommande] = useState({
    pickups: [],
    photo: "https://i.postimg.cc/1zytFbBp/order-photo-sample.jpg",
    delivery: {
      contact: {},
      address: {},
    },
  });


  const { id } = useParams(); // Get the id from the URL

  useEffect(() => {
    const fetchCommande = async () => {

      try {
        const token = localStorage.getItem('token')

        const response = await axios.get(`https://api.express.ci/partners/orders/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + token  // Replace with your actual token
          }
        });
        setCommande(response.data);
      } catch (error) {
        console.error('Error fetching commande details:', error);
      }
    };

    fetchCommande();
  }, [id]);

  let statusText;


  const getBadgeContent = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'En attente', color: '#ffd700' }; // Gold color for pending
      case 'delivered':
        return { text: 'Livré', color: '#28a745' }; // Green color for delivered
      case 'canceled':
        return { text: 'Annulé', color: '#dc3545' }; // Red color for canceled
      case 'inprocess':
        return { text: 'En cours', color: '#17a2b8' }; // Blue color for in process
      default:
        return { text: 'Inconnu', color: '#6c757d' }; // Gray color for unknown status
    }
  };

  const updateCommande = async () => {
    try {
      const payload = {
        order: {
          codAmount: commande.codAmount,
          cod: true,
          deliveryFee: commande.deliveryFee,
          delivery: {
            id: commande.delivery.id,
            type: commande.delivery.type,
            deadline: commande.delivery.deadline,
            instructions: commande.delivery.instructions,
            contact: {
              name: 'test',
              phoneNumber: commande.delivery.contact.phoneNumber
            },
            address: {
              name: commande.delivery.address.name,
              landmark: commande.delivery.address.landmark,
              city: commande.delivery.address.city,
              placeId: 'placeId1',
              latitude: commande.delivery.address.latitude,
              longitude: commande.delivery.address.longitude
            }
          },
          pickups: commande.pickups.map(pickup => ({
            size: pickup.size,
            weight: pickup.weight,
            dimensions: pickup.dimensions,
            quantity: pickup.quantity,
            description: pickup.description,
            contact: {
              name: pickup.contact.name,
              phoneNumber: '+2250702029254'
              // pickup.contact.phoneNumber
            },
            address: {
              name: pickup.address.name,
              landmark: pickup.address.landmark,
              city: pickup.address.city,
              placeId: 'placeId1',
              latitude: pickup.address.latitude,
              longitude: pickup.address.longitude
            }
          }))
        }
      };
      //console.log(payload)
      const token = localStorage.getItem('token');
      //console.log(token)
      await axios.put(`https://api.express.ci/partners/orders/${id}`, payload, {
        headers: {

          'Authorization': `Bearer ${token}` // Replace with your actual token
        }
      });

      alert('Commande updated successfully!');
    } catch (error) {
      console.error('Error updating commande:', error);
      alert('Error updating commande. Please try again.');
    }
  };

  const handlUpadate = () => {
    updateCommande();
  };

  const handleClick = (status) => {
    const token = localStorage.getItem('token')
    axios.put(
      `https://api.express.ci/partners/orders/${id}/status`,
      { status: status }, // Request body
      {
        headers: {
          'Authorization': 'Bearer ' + token // Replace with your actual token
        }
      }
    ).then((response) => {
      alert('le status du commande a ete modifié avec success')
      window.location.reload()
    }).catch((error) => {
      alert(error)
    })

  };
  const badgeContent = getBadgeContent(commande?.status?.status);


  return (
    <div style={{marginTop:'8%', padding:"30px", }}>
      <div className="header">
        <div className="header-left">
          <h1>Commande #{commande.uuid}</h1>
          <span className="badge" style={{ backgroundColor: badgeContent.color }}>
            {badgeContent.text}
          </span>
        </div>
        <div class="status-section">
          <span class="status-instructions">
            Mettre à jour la commande :
          </span>
          <div className="status-buttons">
            <div>
              <button
                className={`status-button en-attente m-2 ${statusText === 'en attente' ? 'disabled' : ''}`}
                onClick={() => handleClick('pending')}
              >
                En attente
              </button>
              <button
                className={`status-button en-cours m-2 ${statusText === 'en cours' ? 'disabled' : ''}`}
                onClick={() => handleClick('inprocess')}
              >
                En cours
              </button>
              <button
                className={`status-button livre m-2 ${statusText === 'delivered' ? 'disabled' : ''}`}
                onClick={() => handleClick('delivered')}
              >
                Livré
              </button>
              <button
                className={`status-button annuler m-2 ${statusText === 'Annulé' ? 'disabled' : ''}`}
                onClick={() => handleClick('canceled')}
              >
                Annulé
              </button>
            </div>
          </div>
          <button
            onClick={() => handlUpadate()}
            class="modify-button">Modifier</button>
        </div>
      </div>
      <div className="columns" style={{marginTop:'2%'}}>
        <div className="column">
          <div className="section-header">Informations Générales</div>
          <table>
            <tbody>
              <tr>
                <th># Numéro</th>
                <td><span>{commande.uuid}</span></td>
              </tr>
              <tr>
                <th >Frais de Livraison</th>
                <td><span>{commande?.deliveryFee?.toLocaleString('en', { useGrouping: true }).replace(/,/g, ' ')}</span></td>
              </tr>
              <tr>
                <th >Montant Article</th>
                <td><span>{commande?.codAmount?.toLocaleString('en', { useGrouping: true }).replace(/,/g, ' ')}</span></td>
              </tr>

              <tr>
                <th>Créé le</th>
                <td><span>{commande.createdAt}</span></td>
              </tr>
              <tr>
                <th>Mis à Jour le</th>
                <td><span>{commande.updatedAt}</span></td>
              </tr>
              <tr>
                <th>Statut</th>
                <td><span>    {badgeContent.text}</span></td>
              </tr>
            </tbody>
          </table>
          <div className="section-header">Informations de l'Utilisateur</div>
          <table>
            <tbody>
              <tr>
                <th>Nom</th>
                <td><span>{commande.user?.name}</span></td>
              </tr>
              <tr>
                <th>Téléphone</th>
                <td><span>{commande.user?.phoneNumber}</span></td>
              </tr>
              <tr>
                <th>WhatsApp</th>
                <td><span>{commande.user?.whatsapp}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="column">
          <div className="section-header">Lieu de Récupération</div>
          <table>


            <tbody>
              {commande?.pickups?.map((pickup, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <th>Nom du contact</th>
                    <td><span>{pickup?.contact?.name || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Téléphone</th>
                    <td><span>{pickup?.contact?.phoneNumber || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Adresse</th>
                    <td><span>{pickup?.address?.name || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Repère</th>
                    <td><span>{pickup?.address?.landmark || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Ville</th>
                    <td><span>{pickup?.address?.city || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Taille</th>
                    <td><span>{pickup?.size || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Poids</th>
                    <td><span>{pickup?.weight || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Quantité</th>
                    <td><span>{pickup?.quantity || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Dimensions</th>
                    <td><span>{pickup?.dimensions || ''}</span></td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td><span>{pickup?.description || ''}</span></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="column">
          <div className="section-header">Détails de la Livraison</div>
          <table>
            <tbody>

              <tr>
                <th>Nom du contact</th>
                <td><span>{commande.delivery.contact?.name || ''}</span></td>
              </tr>
              <tr>
                <th >Téléphone</th>
                <td><span>{commande.delivery.contact?.phoneNumber || ''}</span></td>
              </tr>
              <tr>
                <th >Adresse</th>
                <td><span>{commande.delivery.address?.name || ''}</span></td>
              </tr>
              <tr>
                <th>Repère</th>
                <td><span>{commande.delivery.address?.landmark || ''}</span></td>
              </tr>
              <tr>
                <th >Ville</th>
                <td>
                  <span>{commande.delivery.address?.city || ''}</span>
                </td>
              </tr>
              <tr>
                <th>Type</th>
                <td><span>{commande.delivery.type || ''}</span></td>
              </tr>
              <tr>
                <th>Date Limite</th>
                <td><span>{commande.delivery.deadline || ''}</span></td>
              </tr>
              <tr>
                <th>Instructions</th>
                <td><span>{commande.delivery.instructions || ''}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* {commande?.pickups[0]?.photoUrl && (
          <div className="photo-column">
            <div className="section-header">Photo de la Commande</div>
            <div className="photo-container">
              <img
                src={commande.pickups[0].photoUrl}
                alt="Photo de la commande"
              />
            </div>
          </div>
        )} */}
        {
          commande?.pickups[0]?.photoUrl!=null ?
          (
            <div className="photo-column">
            <div className="section-header">Photo de la Commande</div>
            <div className="photo-container">
              <img
                src={commande.pickups[0].photoUrl}
                alt="Photo de la commande"
              />
            </div>
          </div>
          ): (
            <div className="photo-column">
            <div className="section-header">Photo de la Commande</div>
            <div className="photo-container">
              <img
                src='https://i.postimg.cc/1zytFbBp/order-photo-sample.jpg'
                alt="Photo de la commande"
              />
            </div>
          </div>
          )
        }
      </div>
    </div>
  );
};

export default DetailCommande;


