import Nav from "react-bootstrap/Nav";
import React, {useEffect, useState} from "react";
import axios from "axios";
import './nav.css'

function Header(){

    const [balance, setBalance] = useState(0); // Initialize with a default value

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.express.ci/partners/wallet/balance', {
                    headers: {
                        'Authorization': `Bearer `+token // Use environment variable for token
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally handle errors, e.g., show a notification or set an error state
            }
        };

        fetchData();

        // Optional cleanup function if needed
        return () => {
            // Cleanup logic if necessary
        };
    }, []); // Empty dependency array means this effect runs only once

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('fr-FR').format(number);
    };

    return (
        <header >
            <Nav className="justify-content-center navbar">
                <Nav.Item>
                    <Nav.Link>
                        <div className="navbar-logo">
                            <img
                                src="https://placehold.co/720/000000/FFF?text=XP&font=Inter"
                                alt="Express Logo"
                            />
                            <div className="express">EXPRESS</div>
                        </div>
                    </Nav.Link>
                </Nav.Item>

                <div className="navbar-links-container ">
                    <ul className="navbar-links mt-3">
                        <li className="navbar-link">
                            <a href="/dashboard">Tableau de Bord</a>
                        </li>
                        <li className="navbar-link">
                            <a href="/liste-commandes">Commandes</a>
                        </li>
                        <li className="navbar-link">
                            <a href="#">Transactions</a>
                        </li>
                        <li className="navbar-link">
                            <a href="#">Paramètres</a>
                        </li>
                        <li className="navbar-link">
                            <a href="#" onClick={logout}>Déconnexion</a>
                        </li>
                    </ul>
                </div>

                <div className="wallet-balance-container">
                    <span className="wallet-balance-label">Portefeuille</span>
                    <span className="wallet-balance">{formatNumber(balance)} ₣</span>
                </div>
            </Nav>
        </header>
    )
}

export default Header