import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

function CommandesTable({ commandes }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100; // Number of items per page

    if (!Array.isArray(commandes)) {
        return <div>Invalid data format</div>; // Display error message if commandes is not an array
    }

    // Calculate the index of the first and last item to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = commandes.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages
    const totalPages = Math.ceil(commandes.length / itemsPerPage);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Function to determine badge content based on status
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

    return (
        <div>
            <Table striped  hover variant="light">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Numéro</th>
                        <th>Récuperation</th>
                        <th>Téléphone</th>
                        <th>Livraison</th>
                        <th>Téléphone</th>
                        <th>Frais de livraison</th>
                        <th>Montant Article</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="text-center">No orders available</td>
                        </tr>
                    ) : (
                        currentItems.map((commande) => {
                            const badgeContent = getBadgeContent(commande.status.status);

                            return (
                                <tr key={commande.id}>
                                    <td>
                                        <span className="badge w-75" style={{ backgroundColor: badgeContent.color }}>
                                            {badgeContent.text}
                                        </span>
                                    </td>
                                    <td>{new Date(commande.createdAt).toLocaleDateString()}</td>
                                    <td>{commande.uuid}</td>
                                    <td>{commande.pickups[0]?.address.city}</td>
                                    <td>{commande.pickups[0]?.contact.phoneNumber}</td>
                                    <td>{commande.delivery?.address.city}</td>
                                    <td>{commande.delivery?.contact.phoneNumber}</td>
                                    <td>{commande.deliveryFee.toLocaleString('en', { useGrouping: true }).replace(/,/g, ' ')}</td>
                                    <td>{commande.codAmount.toLocaleString('en', { useGrouping: true }).replace(/,/g, ' ')}</td>
                                    <td className='m-3'>
                                        <a
                                            className="mr-4 link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                            href={`/commande/${commande.id}`}
                                            style={{ marginRight: '10%' }}
                                        >
                                            Consulter
                                        </a>
                                        <a
                                            className="mr-4 link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                            href={`/commande/edit/${commande.id}`}
                                        >
                                            Modifier
                                        </a>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-3">
                <Pagination>
                    <Pagination.Prev
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((number) => (
                        <Pagination.Item
                            key={number + 1}
                            active={number + 1 === currentPage}
                            onClick={() => handlePageChange(number + 1)}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
        </div>
    );
}

export default CommandesTable;
