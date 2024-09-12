import React, { useEffect, useState, CSSProperties } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

import {BeatLoader} from "react-spinners";
import {citizen} from "../utils/cities";
import Swal from "sweetalert2";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#007BFF",
};
// Simple spinner component


const EditCommande = () => {
    const navigate = useNavigate();
    let color="#007BFF";
    const [todayDate, setTodayDate] = useState('');
    const [commande, setCommande] = useState({
        pickups: [{}],
        photo: "https://i.postimg.cc/1zytFbBp/order-photo-sample.jpg",
        delivery: {
            contact: {},
            address: {},
        },
    });
    const [loading, setLoading] = useState(true); // Add loading state
    const { id } = useParams();

    useEffect(() => {
        const fetchCommande = async () => {
            const token = localStorage.getItem('token');
            setLoading(true); // Set loading to true when starting to fetch
            try {
                const response = await axios.get(`https://api.express.ci/partners/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Replace with your actual token
                    }
                });
                const data = response.data;
                console.log(data)
                // Obtenez la date actuelle au lieu d'utiliser les dates récupérées
                const today = new Date();
                const formatDate = (date) => {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont basés sur 0
                    const year = date.getFullYear();
                    return `${year}-${month}-${day}`; // Format pour l'input de type date
                };

                setTodayDate(formatDate(today));

                setCommande({
                    ...data,
                    createdAt: formatDate(today),
                    updatedAt: formatDate(today),
                });
            } catch (error) {
                console.error('Error fetching commande details:', error);
            } finally {
                setLoading(false); // Set loading to false after fetch is done
            }
        };

        fetchCommande();
    }, [id]);

    const updateCommande = async () => {
        setLoading(true); // Set loading to true when starting to update
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

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: 'Commande updated successfully!',
                showConfirmButton: false,
                backdrop: false,
                timer: 1500
            });
            navigate('/liste-commandes')
            //alert('Commande updated successfully!');
        } catch (error) {
            console.error('Error updating commande:', error);
            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: error.response.data?.message,
                showConfirmButton: false,
                backdrop: false,
                timer: 1500
            });
        } finally {
            setLoading(false); // Set loading to false after update is done
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, index, key] = name.split('.'); // Ex: "pickups.0.someKey" or "deliveryFee"

        setCommande(prev => {
            const updatedCommande = { ...prev };

            if (field === 'pickups') {
                const idx = parseInt(index, 10); // Conversion en nombre
                updatedCommande.pickups[idx] = {
                    ...updatedCommande.pickups[idx], // Assure la non-mutation de l'objet
                    [key]: key === 'deliveryFee' ? parseFloat(value) || 0 : value // Gestion des nombres
                };
            } else if (key) {
                // Pour d'autres objets imbriqués
                updatedCommande[field] = {
                    ...updatedCommande[field], // Assure la non-mutation de l'objet
                    [key]: key === 'deliveryFee' ? parseFloat(value) || 0 : value // Gestion des nombres
                };
            } else {
                // Pour les champs simples (comme "deliveryFee" seul)
                updatedCommande[field] = field === 'deliveryFee' ? parseFloat(value) || 0 : value;
            }

            return updatedCommande;
        });
    };

    const handleAddPickup = () => {
        setCommande(prev => ({
            ...prev,
            pickups: [...prev.pickups, { /* Default pickup values */ }]
        }));
    };

    const handleRemovePickup = (index) => {
        setCommande(prev => ({
            ...prev,
            pickups: prev.pickups.filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        updateCommande();
    };

    let statusText;
    switch (commande?.status?.status) {
        case 'inprocess':
            statusText = 'en cours';
            break;
        case 'delivered':
            statusText = 'envoyée';
            break;
        case 'pending':
            statusText = 'en attente';
            break;
        default:
            statusText = '';
            break;
    }

    // Render a spinner if loading
    if (loading) {
        return <div className="sweet-loading" style={{justifyContent:'center'}}>
            <BeatLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>;
    }

    return (
        <div style={{
            position: 'relative',
            marginTop: 'calc(17vh)',
            padding: "30px",
            height: 'calc(100vh - 30px)',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            overflow: 'visible',
            boxSizing: 'border-box'
        }}>
            <div className="header">
                <div className="header-left">
                    <h1>Commande #{commande.uuid}</h1>
                    <span className="badge">{statusText}</span>
                </div>
                <button className="btn btn-success" onClick={handleSave}>Enregistrer</button>
            </div>
            <div className="legend mt-4 mb-4 d-flex justify-content-center">
                Les champs marqués d'un <span style={{color: 'red'}}>*</span> sont obligatoires.
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
                                            <td><input placeholder='Automatique' type="text" value={commande.uuid}
                                                       disabled/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Frais de Livraison</th>
                                            <td><input className="required-field" name="deliveryFee" type="number"
                                                       value={commande.deliveryFee} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Montant Article</th>
                                            <td><input className="required-field" name="codAmount" type="number"
                                                       value={commande.codAmount} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th>Créé le</th>
                                            <td><input type="text" value={commande.createdAt} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Mis à Jour le</th>
                                            <td><input type="text" value={commande.updatedAt} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Statut</th>
                                            <td>
                                                {
                                                    commande?.status?.status === 'inprocess'
                                                        ? <input type="text" value='en cours' disabled/>
                                                        : commande?.status?.status === 'delivered'
                                                            ? <input type="text" value='envoyée' disabled/>
                                                            : commande?.status?.status === 'pending'
                                                                ? <input type="text" value='en attente' disabled/>
                                                                : ''
                                                }
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className="section-header">Informations de l'Utilisateur</div>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <th>Nom</th>
                                            <td><input type="text" name="user.name" value={commande?.user?.name}
                                                       onChange={handleChange}
                                                       disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Téléphone</th>
                                            <td><input type="text" name="user.phoneNumber"
                                                       value={commande?.user?.phoneNumber}
                                                       onChange={handleChange} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>WhatsApp</th>
                                            <td><input type="text" name="user.whatsapp" value={commande?.user?.whatsapp}
                                                       onChange={handleChange} disabled/></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="col-md-3">
                                    {commande.pickups.map((pickup, index) => (
                                        <div key={index}>

                                            <div
                                                className="section-header d-flex justify-content-between align-items-center">
                                                <div className="mx-auto">
                                                    Lieu de Récupération {index + 1}/{commande.pickups.length}
                                                </div>
                                                <div className="pickup-header">
                                                    {
                                                        index + 1 > 1 &&
                                                        <button type="button" className="btn btn-danger btn-sm"
                                                                onClick={() => handleRemovePickup(index)}>Supprimer</button>
                                                    }
                                                </div>
                                            </div>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <th>Nom du contact</th>
                                                    <td><input type="text" name={`pickups.${index}.contact.name`}
                                                               value={pickup.contact?.name} onChange={handleChange}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Téléphone</th>
                                                    <td><input className="required-field" type="text"
                                                               name={`pickups.${index}.contact.phoneNumber`}
                                                               value={pickup.contact?.phoneNumber}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Adresse</th>
                                                    <td><input className="required-field" type="text"
                                                               name={`pickups.${index}.address.name`}
                                                               value={pickup.address?.name}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th>Repère</th>
                                                    <td><input type="text" name={`pickups.${index}.address.landmark`}
                                                               value={pickup.address?.landmark}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Ville</th>
                                                    <td><input className="required-field" type="text"
                                                               name={`pickups.${index}.address.city`}
                                                               value={pickup.address?.city}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Taille</th>
                                                    <td>
                                                        <select className="required-field"
                                                                name={`pickups.${index}.size`}
                                                                value={pickup.size} onChange={handleChange}>
                                                            <option value="S">S</option>
                                                            <option value="M">M</option>
                                                            <option value="L">L</option>
                                                            <option value="XL">XL</option>
                                                            <option value="XXL">XXL</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Poids</th>
                                                    <td><input type="number" name={`pickups.${index}.weight`}
                                                               value={pickup.weight}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th>Quantité</th>
                                                    <td><input type="number" name={`pickups.${index}.quantity`}
                                                               value={pickup.quantity}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th>Dimensions</th>
                                                    <td><input type="text" name={`pickups.${index}.dimensions`}
                                                               value={pickup.dimensions} onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th>Description</th>
                                                    <td><input type="text" name={`pickups.${index}.description`}
                                                               value={pickup.description} onChange={handleChange}/></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                    <button type="button" className='btn btn-sm btn-primary w-100'
                                            onClick={handleAddPickup}>Ajouter un lieu
                                        de récupération
                                    </button>
                                </div>

                                <div className="col-md-3">
                                    <div className="section-header">Détails de la Livraison</div>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <th>Nom du contact</th>
                                            <td><input type="text" name="delivery.contact.name"
                                                       value={commande.delivery.contact.name}
                                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Téléphone</th>
                                            <td><input className="required-field" type="text"
                                                       name="delivery.contact.phoneNumber"
                                                       value={commande.delivery.contact.phoneNumber}
                                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Adresse</th>
                                            <td><input className="required-field" type="text"
                                                       name="delivery.address.name"
                                                       value={commande.delivery.address.name} onChange={handleChange}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Repère</th>
                                            <td><input type="text" name="delivery.address.landmark"
                                                       value={commande.delivery.address.landmark}
                                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Ville</th>
                                            <td>
                                                <select className="required-field" name="delivery.address.city"
                                                        value={commande.delivery.address.city} onChange={handleChange}>
                                                    <option value="" disabled> Choisir</option>
                                                    {citizen.map((ville, index) => (
                                                        <option key={index}
                                                                value={ville.libelle}>{ville.libelle}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td><input type="text" name="delivery.type" value={commande.delivery.type}
                                                       onChange={handleChange} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Date Limite</th>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="delivery.deadline"
                                                    value={todayDate} // Use today's date if deadline is not set
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Instructions</th>
                                            <td><input type="text" name="delivery.instructions"
                                                       value={commande.delivery.instructions}
                                                       onChange={handleChange}/></td>
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
                                            <td><input placeholder='Automatique' type="text" value={commande.uuid} disabled/></td>
                        </tr>
                        <tr>
                            <th className="required">Frais de Livraison</th>
                            <td><input className="required-field" name="deliveryFee" type="number"
                                       value={commande.deliveryFee} onChange={handleChange}/></td>
                        </tr>
                        <tr>
                            <th className="required">Montant Article</th>
                            <td><input className="required-field" name="codAmount" type="number"
                                       value={commande.codAmount} onChange={handleChange}/></td>
                        </tr>
                        <tr>
                            <th>Créé le</th>
                            <td><input type="text" value={commande.createdAt} disabled/></td>
                        </tr>
                        <tr>
                            <th>Mis à Jour le</th>
                            <td><input type="text" value={commande.updatedAt} disabled/></td>
                        </tr>
                        <tr>
                            <th>Statut</th>
                            <td>
                                {
                                    commande?.status?.status === 'inprocess'
                                        ? <input type="text" value='en cours' disabled/>
                                        : commande?.status?.status === 'delivered'
                                            ? <input type="text" value='envoyée' disabled/>
                                            : commande?.status?.status === 'pending'
                                                ? <input type="text" value='en attente' disabled/>
                                                : ''
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="section-header">Informations de l'Utilisateur</div>
                    <table>
                        <tbody>
                        <tr>
                            <th>Nom</th>
                            <td><input type="text" name="user.name" value={commande?.user?.name} onChange={handleChange}
                                       disabled/></td>
                        </tr>
                        <tr>
                            <th>Téléphone</th>
                            <td><input type="text" name="user.phoneNumber" value={commande?.user?.phoneNumber}
                                       onChange={handleChange} disabled/></td>
                        </tr>
                        <tr>
                            <th>WhatsApp</th>
                            <td><input type="text" name="user.whatsapp" value={commande?.user?.whatsapp}
                                       onChange={handleChange} disabled/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="col-md-4">
                    {commande.pickups.map((pickup, index) => (
                        <div key={index}>

                            <div className="section-header d-flex justify-content-between align-items-center">
                                <div className="mx-auto">
                                    Lieu de Récupération {index + 1}/{commande.pickups.length}
                                </div>
                                <div className="pickup-header">
                                    {
                                        index + 1 > 1 && <button type="button" className="btn btn-danger btn-sm"
                                                                 onClick={() => handleRemovePickup(index)}>Supprimer</button>
                                    }
                                </div>
                            </div>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Nom du contact</th>
                                    <td><input type="text" name={`pickups.${index}.contact.name`}
                                               value={pickup.contact?.name} onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th className="required">Téléphone</th>
                                    <td><input className="required-field" type="text"
                                               name={`pickups.${index}.contact.phoneNumber`}
                                               value={pickup.contact?.phoneNumber} onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th className="required">Adresse</th>
                                    <td><input className="required-field" type="text"
                                               name={`pickups.${index}.address.name`} value={pickup.address?.name}
                                               onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th>Repère</th>
                                    <td><input type="text" name={`pickups.${index}.address.landmark`}
                                               value={pickup.address?.landmark} onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th className="required">Ville</th>
                                    <td><input className="required-field" type="text"
                                               name={`pickups.${index}.address.city`} value={pickup.address?.city}
                                               onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th className="required">Taille</th>
                                    <td>
                                        <select className="required-field" name={`pickups.${index}.size`}
                                                value={pickup.size} onChange={handleChange}>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Poids</th>
                                    <td><input type="number" name={`pickups.${index}.weight`} value={pickup.weight}
                                               onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th>Quantité</th>
                                    <td><input type="number" name={`pickups.${index}.quantity`} value={pickup.quantity}
                                               onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th>Dimensions</th>
                                    <td><input type="text" name={`pickups.${index}.dimensions`}
                                               value={pickup.dimensions} onChange={handleChange}/></td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td><input type="text" name={`pickups.${index}.description`}
                                               value={pickup.description} onChange={handleChange}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                    <button type="button" className='btn btn-sm btn-primary w-100' onClick={handleAddPickup}>Ajouter un
                        lieu
                        de récupération
                    </button>
                </div>

                <div className="col-md-4">
                    <div className="section-header">Détails de la Livraison</div>
                    <table>
                        <tbody>
                        <tr>
                            <th>Nom du contact</th>
                            <td><input type="text" name="delivery.contact.name" value={commande.delivery.contact.name}
                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Téléphone</th>
                                            <td><input className="required-field" type="text" name="delivery.contact.phoneNumber"
                                                       value={commande.delivery.contact.phoneNumber} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Adresse</th>
                                            <td><input className="required-field" type="text" name="delivery.address.name"
                                                       value={commande.delivery.address.name} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th>Repère</th>
                                            <td><input type="text" name="delivery.address.landmark"
                                                       value={commande.delivery.address.landmark} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Ville</th>
                                            <td>
                                                <select className="required-field" name="delivery.address.city"
                                                        value={commande.delivery.address.city} onChange={handleChange}>
                                                    <option value="" disabled> Choisir</option>
                                                    {citizen.map((ville, index) => (
                                                        <option key={index} value={ville.libelle}>{ville.libelle}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td><input type="text" name="delivery.type" value={commande.delivery.type}
                                                       onChange={handleChange} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Date Limite</th>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="delivery.deadline"
                                                    value={todayDate} // Use today's date if deadline is not set
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Instructions</th>
                                            <td><input type="text" name="delivery.instructions" value={commande.delivery.instructions}
                                                       onChange={handleChange}/></td>
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

export default EditCommande;


