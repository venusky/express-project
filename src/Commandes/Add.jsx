import React, { useState, CSSProperties } from 'react';
import axios from 'axios';
import {BeatLoader} from "react-spinners";
import {citizen} from "../utils/cities";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#007BFF",
};

// Utility function to format date as DD/MM/YYYY
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Utility function to format date for the date input field (YYYY-MM-DD)
const formatDateForInput = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const AddCommande = () => {
    const navigate = useNavigate();
    let color="#007BFF";
    const today = new Date();
    const todayFormatted = formatDate(today); // For display purposes
    const todayForInput = formatDateForInput(today); // For input value

    // State for the form fields
    const [commande, setCommande] = useState({
        pickups: [{}], // Initialize with one empty pickup
        photo: "https://i.postimg.cc/1zytFbBp/order-photo-sample.jpg",
        delivery: {
            contact: {},
            address: {},
            deadline: todayForInput // Set to today's date in YYYY-MM-DD format
        },
        createdAt: todayFormatted, // Set to today's date in DD/MM/YYYY format
        updatedAt: todayFormatted, // Set to today's date in DD/MM/YYYY format
        status: {},
        user: {},
    });

    // State for loading
    const [loading, setLoading] = useState(false);

    // Function to add a new commande
    const addCommande = async () => {
        setLoading(true); // Start loading
        try {
            const payload = {
                order: {
                    codAmount: commande.codAmount,
                    cod: true,
                    deliveryFee: commande.deliveryFee,
                    delivery: {
                        id: commande.delivery.id,
                        type: 'standard',
                        deadline: commande.delivery.deadline,
                        instructions: commande.delivery.instructions,
                        contact: {
                            name: commande?.delivery?.contact.name,
                            phoneNumber:'+2250702029254',
                            // commande?.delivery?.contact?.phoneNumber
                        },
                        address: {
                            name: commande?.delivery?.address.name,
                            landmark: 'test' ,
                            // commande?.delivery?.address?.landmark
                            city:'Cocody',
                            // commande?.delivery?.address?.city,
                            placeId: 'placeId1', // Use actual place ID if available
                        },
                    },
                    pickups: commande.pickups.map(pickup => ({
                        id: pickup.id,
                        size: pickup.size,
                        weight: pickup.weight,
                        dimensions: pickup.dimensions,
                        quantity: pickup.quantity,
                        description: pickup.description,
                        contact: {
                            name: pickup?.contact?.name,
                            phoneNumber: '+2250702029254',
                            //pickup?.contact?.phoneNumber,
                        },
                        address: {
                            name: pickup?.address?.name,
                            landmark: 'test' ,
                            // landmark: pickup?.address?.landmark,
                            city:'Cocody',
                            // city: pickup?.address?.city,
                            placeId: 'placeId1', // Use actual place ID if available
                        },
                    })),
                },
            };

            // Update the updatedAt field
            const updatedCommande = {
                ...commande,
                updatedAt: formatDate(new Date()), // Update with current date in DD/MM/YYYY format
            };
            const token = localStorage.getItem('token');
            // Make the API call to add the order
            await axios.post('https://api.express.ci/partners/orders', payload, {
                headers: {
                    'Authorization': `Bearer ${token}` // Replace with your actual token
                },
            });
            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: 'Commande ajoutée avec succès !',
                showConfirmButton: false,
                backdrop: false,
                timer: 1500
            });

            navigate('/liste-commandes')

            //alert('Commande ajoutée avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la commande:', error);

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: error.response.data?.message,
                showConfirmButton: false,
                backdrop: false,
                timer: 1500
            });
            //alert('Erreur lors de l\'ajout de la commande. Veuillez réessayer.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        setCommande(prev => {
            const updatedCommande = { ...prev };

            // Handling updates for nested properties
            if (keys.length === 1) {
                if (keys[0] === 'city') {
                    setCity(value); // Update the city state
                } else {
                    updatedCommande[keys[0]] = value;
                }
            } else if (keys.length === 2) {
                // Ensure the nested object exists
                updatedCommande[keys[0]] = updatedCommande[keys[0]] || {};
                updatedCommande[keys[0]][keys[1]] = value;
            } else if (keys.length === 3 && keys[0] === 'pickups') {
                const index = parseInt(keys[1], 10);
                updatedCommande.pickups[index] = updatedCommande.pickups[index] || {};
                updatedCommande.pickups[index][keys[2]] = value;
            } else if (keys.length === 4 && keys[0] === 'pickups') {
                const index = parseInt(keys[1], 10);
                updatedCommande.pickups[index] = updatedCommande.pickups[index] || {};
                updatedCommande.pickups[index][keys[2]] = updatedCommande.pickups[index][keys[2]] || {};
                updatedCommande.pickups[index][keys[2]][keys[3]] = value;
            }

            return updatedCommande;
        });
    };


    const handleAddPickup = () => {
        setCommande(prev => ({
            ...prev,
            pickups: [...prev.pickups, {}],
        }));
    };

    const handleRemovePickup = (index) => {
        setCommande(prev => ({
            ...prev,
            pickups: prev.pickups.filter((_, i) => i !== index),
        }));
    };

    const handleSave = () => {
        addCommande();
    };

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
                    <h1>Nouvelle Commande</h1>
                </div>
                <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                    {loading ? 'Création en cours...' : 'Créer la commande'}
                </button>
            </div>
            <div className="legend mt-4 mb-4 d-flex justify-content-center">
                Les champs marqués d'un <span style={{color: 'red', marginLeft:'2px', marginRight:'2px'}}>*</span> sont obligatoires.
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
                                            <td><input type="text" placeholder='Automatique' disabled/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Frais de Livraison</th>
                                            <td><input className="required-field" name="deliveryFee" type="number"
                                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Montant Article</th>
                                            <td>
                                                <td><input className="required-field" name="codAmount" type="number"
                                                           onChange={handleChange}/></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Crée le</th>
                                            <td><input type="text" value={commande.createdAt} disabled/></td>
                                        </tr>

                                        <tr>
                                            <th>Mis à Jour le</th>
                                            <td><input type="text" value={commande.updatedAt} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Statut</th>
                                            <td>
                                                <input name='status' disabled onChange={handleChange}
                                                       placeholder='En attente'/>
                                            </td>
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
                                                    <th>Nom Contact</th>
                                                    <td><input type="text" name={`pickups.${index}.contact.name`}
                                                               value={pickup.contact?.name}
                                                               onChange={handleChange}/></td>
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
                                                    <td><input type="text"
                                                               name={`pickups.${index}.address.landmark`}
                                                               value={pickup.address?.landmark}
                                                               onChange={handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Ville</th>
                                                    <td>
                                                        <select className="required-field"
                                                                name={`pickups.${index}.address.city`}
                                                                value={pickup.address?.city}
                                                                onChange={handleChange}>
                                                            <option value="" disabled>Choisir</option>
                                                            <option value="" disabled> Choisir</option>
                                                            {citizen.map((ville, index) => (
                                                                <option key={index}
                                                                        value={ville.libelle}>{ville.libelle}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Taille</th>
                                                    <td>
                                                        <select className="required-field"
                                                                name={`pickups.${index}.size`}
                                                                value={pickup.size} onChange={handleChange}>
                                                            <option value="" disabled>Choisir</option>
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
                                                               value={pickup.dimensions} onChange={handleChange}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Description</th>
                                                    <td><input type="text" name={`pickups.${index}.description`}
                                                               value={pickup.description} onChange={handleChange}/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                    <button type="button" className='btn btn-sm btn-primary w-100'
                                            onClick={handleAddPickup}>Ajouter un
                                        lieu
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
                                                       value={commande.delivery.address.name}
                                                       onChange={handleChange}/></td>
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
                                                        value={commande.delivery.address.city}
                                                        onChange={handleChange}>
                                                    <option value="" disabled>Choisir</option>
                                                    {citizen.map((ville) => (
                                                        <option value={ville.libelle}>{ville.libelle}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td><input disabled type="text" name="delivery.type" value='standard'
                                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th>Date Limite</th>
                                            <td><input type="date" name="delivery.deadline"
                                                       value={commande.delivery.deadline}
                                                       onChange={handleChange}/></td>
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
                                            <td><input type="text" placeholder='Automatique' disabled/></td>
                                        </tr>
                                        <tr>
                                            <th className="required">Frais de Livraison</th>
                                            <td><input className="required-field" name="deliveryFee" type="number"
                                                       onChange={handleChange}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="required">Montant Article</th>
                                            <td>
                                                <td><input className="required-field" name="codAmount" type="number"
                                                           onChange={handleChange}/></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Crée le</th>
                                            <td><input type="text" value={commande.createdAt} disabled/></td>
                                        </tr>

                                        <tr>
                                            <th>Mis à Jour le</th>
                                            <td><input type="text" value={commande.updatedAt} disabled/></td>
                                        </tr>
                                        <tr>
                                            <th>Statut</th>
                                            <td>
                                                <input name='status' disabled onChange={handleChange}
                                                       placeholder='En attente'/>
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>

                                </div>

                                <div className="col-md-4">
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
                                                    <th>Nom Contact</th>
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
                                                    <td>
                                                        <select className="required-field"
                                                                name={`pickups.${index}.address.city`}
                                                                value={pickup.address?.city} onChange={handleChange}>
                                                            <option value="" disabled>Choisir</option>
                                                            <option value="" disabled> Choisir</option>
                                                            {citizen.map((ville, index) => (
                                                                <option key={index}
                                                                        value={ville.libelle}>{ville.libelle}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="required">Taille</th>
                                                    <td>
                                                        <select className="required-field"
                                                                name={`pickups.${index}.size`}
                                                                value={pickup.size} onChange={handleChange}>
                                                            <option value="" disabled>Choisir</option>
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
                                            onClick={handleAddPickup}>Ajouter un
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
                                                    <option value="" disabled>Choisir</option>
                                                    {citizen.map((ville) => (
                                                        <option value={ville.libelle}>{ville.libelle}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td><input disabled type="text" name="delivery.type" value='standard'
                                                       onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <th>Date Limite</th>
                                            <td><input type="date" name="delivery.deadline"
                                                       value={commande.delivery.deadline}
                                                       onChange={handleChange}/></td>
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
                            </div>
                        )
                }
            </div>

        </div>

    );
};

export default AddCommande;


