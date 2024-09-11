import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';
import axios from 'axios';

// Register necessary Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [data, setData] = useState([]);
    const [chart, setChart] = useState(null);

    const [pendingOrders, setPendingOrders] = useState(0);
    const [inProcessOrders, setInProcessOrders] = useState(0);
    const [deliveredOrders, setDeliveredOrders] = useState(0);
    const [canceledOrders, setCanceledOrders] = useState(0);

    const [deliveryFeesPending, setDeliveryFeesPending] = useState(0);
    const [deliveryFeesInProcess, setDeliveryFeesInProcess] = useState(0);
    const [deliveryFeesDelivered, setDeliveryFeesDelivered] = useState(0);
    const [deliveryFeesCanceled, setDeliveryFeesCanceled] = useState(0);

    const [amountPending, setAmountPending] = useState(0);
    const [amountInProcess, setAmountInProcess] = useState(0);
    const [amountDelivered, setAmountDelivered] = useState(0);
    const [amountCanceled, setAmountCanceled] = useState(0);

    const [totalAwaitingPayout, setTotalAwaitingPayout] = useState(0);
    const [totalPayoutCompleted, setTotalPayoutCompleted] = useState(0);

    const [loading, setLoading] = useState(true);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [startDate, setStartDate] = useState(today); // Initialize with today's date
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get('https://api.express.ci/partners/dashboard', {
                headers: {
                    'Authorization': 'Bearer '+token}
            });

            const orders = response.data.orders;
            const deliveryFees = response.data.deliveryFees;
            const codAmounts = response.data.codAmounts;

            setData([orders.pending, orders.inprocess, orders.delivered, orders.canceled]);
            setPendingOrders(orders.pending);
            setInProcessOrders(orders.inprocess);
            setDeliveredOrders(orders.delivered);
            setCanceledOrders(orders.canceled);

            setDeliveryFeesPending(deliveryFees.pending);
            setDeliveryFeesInProcess(deliveryFees.inprocess);
            setDeliveryFeesDelivered(deliveryFees.delivered);
            setDeliveryFeesCanceled(deliveryFees.canceled);

            setAmountPending(codAmounts.pending);
            setAmountInProcess(codAmounts.inprocess);
            setAmountDelivered(codAmounts.delivered);
            setAmountCanceled(codAmounts.canceled);

            setTotalAwaitingPayout(codAmounts.totalAwaitingPayout);
            setTotalPayoutCompleted(codAmounts.totalPayoutCompleted);
            setLoading(false); // Data fetching is complete
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        // Cleanup previous chart if it exists
        if (chart) {
            chart.destroy();
        }

        // Create new chart
        const ctx = document.getElementById("ordersChart").getContext("2d");
        const newChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["En Attente", "En Cours", "Livré", "Annulé"],
                datasets: [{
                    data: data,
                    backgroundColor: ["#FFCC00", "#007BFF", "#28a745", "#DC3545"],
                    hoverOffset: 4,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "right",
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const label = tooltipItem.label || "";
                                const value = tooltipItem.raw || 0;
                                const total = tooltipItem.chart._metasets[0].total || 1;
                                const percentage = ((value / total) * 100).toFixed(1) + "%";
                                return `${label}: ${value} (${percentage})`;
                            },
                        },
                    },
                },
            },
        });

        setChart(newChart);

        return () => {
            if (newChart) {
                newChart.destroy();
            }
        };
    }, [data]);

    const formatNumber = (number) => {
        return new Intl.NumberFormat('fr-FR').format(number);
    };

    const handleFilter = async () => {
        // Construct URL with query parameters for filtering
        let url = 'https://api.express.ci/partners/dashboard?';

        if (phoneNumber) url += `phoneNumber=${phoneNumber}&`;
        if (startDate) url += `startDate=${startDate}&`;
        if (endDate) url += `endDate=${endDate}`;

        try {
           

            const response = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer '+token               
                 }
            });

            const orders = response.data.orders;
            const deliveryFees = response.data.deliveryFees;
            const codAmounts = response.data.codAmounts;

            setData([orders.pending, orders.inprocess, orders.delivered, orders.canceled]);
            setPendingOrders(orders.pending);
            setInProcessOrders(orders.inprocess);
            setDeliveredOrders(orders.delivered);
            setCanceledOrders(orders.canceled);

            setDeliveryFeesPending(deliveryFees.pending);
            setDeliveryFeesInProcess(deliveryFees.inprocess);
            setDeliveryFeesDelivered(deliveryFees.delivered);
            setDeliveryFeesCanceled(deliveryFees.canceled);

            setAmountPending(codAmounts.pending);
            setAmountInProcess(codAmounts.inprocess);
            setAmountDelivered(codAmounts.delivered);
            setAmountCanceled(codAmounts.canceled);

            setTotalAwaitingPayout(codAmounts.totalAwaitingPayout);
            setTotalPayoutCompleted(codAmounts.totalPayoutCompleted);

        } catch (error) {
            console.error('Error filtering data:', error);
        }
    };

    const handleReset = () => {
        setPhoneNumber('');
        setStartDate(today); // Reset to today's date
        setEndDate('');
        // Re-fetch the data without filters
        fetchData();
    };

    return (
        <div className="dashboard" style={{marginTop:'23%'}} >
            <div className="filter-container d-flex justify-content-center gap-2 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Numéro de téléphone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength="10"
                />
                <input
                    type="date"
                    className="form-control"
                    placeholder="De la date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="form-control"
                    placeholder="À la date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button className="btn btn-dark filter-button" onClick={handleFilter}>Filtrer</button>
                <button className="btn btn-outline-dark reset-button" onClick={handleReset}>Afficher tout</button>
            </div>

            <div className="row g-3">
                <div className="col-md-3">
                    <div className="stat-card border-start border-warning">
                        <p style={{ color: '#ffcc00' }}>{formatNumber(pendingOrders)}</p>
                        <h3 className="text-uppercase text-muted">Commandes en Attente</h3>
                        <span className="small">🚚 {formatNumber(deliveryFeesPending)} ₣ Frais de Livraison</span><br />
                        <span className="small">🛒 {formatNumber(amountPending)} ₣ Montant Articles</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card border-start border-primary">
                        <p style={{ color: '#007bff' }}>{formatNumber(inProcessOrders)}</p>
                        <h3 className="text-uppercase text-muted">Commandes en Cours</h3>
                        <span className="small">🚚 {formatNumber(deliveryFeesInProcess)} ₣ Frais de Livraison</span><br />
                        <span className="small">🛒 {formatNumber(amountInProcess)} ₣ Montant Articles</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card border-start border-success">
                        <p style={{ color: '#28a745' }}>{formatNumber(deliveredOrders)}</p>
                        <h3 className="text-uppercase text-muted">Commandes <br />Livrées</h3>
                        <span className="small">🚚 {formatNumber(deliveryFeesDelivered)} ₣ Frais de Livraison</span><br />
                        <span className="small">🛒 {formatNumber(amountDelivered)} ₣ Montant Articles</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card border-start border-danger">
                        <p style={{ color: '#dc3545' }}>{formatNumber(canceledOrders)}</p>
                        <h3 className="text-uppercase text-muted">Commandes Annulées</h3>
                        <span className="small">🚚 {formatNumber(deliveryFeesCanceled)} ₣ Frais de Livraison</span><br />
                        <span className="small">🛒 {formatNumber(amountCanceled)} ₣ Montant Articles</span>
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-4 mb-4">
                <div className="col-md-6">
                    <div className="stat-card border-start border-info">
                        <h3 className="text-uppercase text-muted">Total Montant Versé</h3>
                        <p className="text-primary">{formatNumber(totalPayoutCompleted)} ₣</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="stat-card border-start border-info">
                        <h3 className="text-uppercase text-muted">
                            Total Versement en Attente
                        </h3>
                        <p className="text-info">{formatNumber(totalAwaitingPayout)} ₣</p>
                    </div>
                </div>
            </div>
            <div className="chart-container">
                <canvas id="ordersChart"></canvas>
            </div>
        </div>
    );
};

export default Dashboard;
