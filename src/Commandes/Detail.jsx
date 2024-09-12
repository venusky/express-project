import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './detailStyle.css'
import Swal from "sweetalert2";


const DetailCommande = () => {
  const navigate = useNavigate();
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

    //const handlUpadate = () => {
   // updateCommande();
  //};

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

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: 'le status du commande a ete modifié avec success',
        showConfirmButton: false,
        backdrop: false,
        timer: 1500
      });

      window.location.reload()
    }).catch((error) => {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response.data?.message,
        showConfirmButton: false,
        backdrop: false,
        timer: 1500
      });
      //alert(JSON.stringify(error.response))
    })

  };
  const badgeContent = getBadgeContent(commande?.status?.status);


  return (
      <div style={{
        position: 'relative',
        marginTop: 'calc(12vh)',
        padding: "30px",
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'visible',
        boxSizing: 'border-box'
      }}>
        <div className="header">
          <div className="header-left">
            <h1>Commande #{commande.uuid}</h1>
            <span className="badge" style={{backgroundColor: badgeContent.color}}>
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
                onClick={() => navigate(`/commande/edit/${commande.id}`)}
                class="modify-button">Modifier
            </button>
          </div>
        </div>
        <div className="legend mt-4 mb-4 d-flex justify-content-center">

        </div>
        <div className="">
          {
            commande?.pickups[0]?.photoUrl ?
                (
                    <div className={"row"}>
                      <div className="col-md-3">
                        <div className="section-header">Informations Générales</div>
                        <table>
                          <tbody>
                          <tr>
                            <th># Numéro</th>
                            <td><span>{commande.uuid}</span></td>
                          </tr>
                          <tr>
                            <th>Frais de Livraison</th>
                            <td>
                              <span>{commande?.deliveryFee?.toLocaleString('en', {useGrouping: true}).replace(/,/g, ' ')}</span>
                            </td>
                          </tr>
                          <tr>
                            <th>Montant Article</th>
                            <td>
                              <span>{commande?.codAmount?.toLocaleString('en', {useGrouping: true}).replace(/,/g, ' ')}</span>
                            </td>
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

                      <div className="col-md-3">
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

                      <div className="col-md-3">
                        <div className="section-header">Détails de la Livraison</div>
                        <table>
                          <tbody>

                          <tr>
                            <th>Nom du contact</th>
                            <td><span>{commande.delivery.contact?.name || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Téléphone</th>
                            <td><span>{commande.delivery.contact?.phoneNumber || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Adresse</th>
                            <td><span>{commande.delivery.address?.name || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Repère</th>
                            <td><span>{commande.delivery.address?.landmark || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Ville</th>
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
                      <div className="col-md-3">
                        <div className="section-header">Photo de la Commande</div>
                        <div className="photo-container">
                          <img
                              src={commande.pickups[0].photoUrl}
                              alt="Photo de la commande"
                          />
                        </div>
                      </div>
                    </div>

                ) : (
                    <div className={"row"}>
                      <div className="col-md-4">
                        <div className="section-header">Informations Générales</div>
                        <table>
                          <tbody>
                          <tr>
                            <th># Numéro</th>
                            <td><span>{commande.uuid}</span></td>
                          </tr>
                          <tr>
                <th>Frais de Livraison</th>
                <td><span>{commande?.deliveryFee?.toLocaleString('en', {useGrouping: true}).replace(/,/g, ' ')}</span>
                </td>
              </tr>
              <tr>
                <th>Montant Article</th>
                <td><span>{commande?.codAmount?.toLocaleString('en', {useGrouping: true}).replace(/,/g, ' ')}</span>
                </td>
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

          <div className="col-md-4">
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

          <div className="col-md-4">
            <div className="section-header">Détails de la Livraison</div>
                        <table>
                          <tbody>

                          <tr>
                            <th>Nom du contact</th>
                            <td><span>{commande.delivery.contact?.name || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Téléphone</th>
                            <td><span>{commande.delivery.contact?.phoneNumber || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Adresse</th>
                            <td><span>{commande.delivery.address?.name || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Repère</th>
                            <td><span>{commande.delivery.address?.landmark || ''}</span></td>
                          </tr>
                          <tr>
                            <th>Ville</th>
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

                    </div>
                )
          }
        </div>

      </div>
  );
};

export default DetailCommande;


