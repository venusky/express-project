import React, { useEffect, useState , CSSProperties} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CommandesTable from './CommandesTable';
import axios from 'axios';
import './style.css'; // Importing the CSS module
import {BeatLoader} from "react-spinners";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#007BFF",
};


function ListCommandes() {

    let color="#007BFF";

    const [commandes, setCommandes] = useState([]);
    const [commandesInProcess, setCommandesInProcess] = useState([]);
    const [canceledCommandes, setCanceledCommandes] = useState([]);
    const [DelevriedCommandes, setDelevriedCommandes] = useState([]);
    const [penddingCommandes, setPenddingCommandes] = useState([]);


    const [loading, setLoading] = useState(true);
    const [searchQueryNum, setSearchQueryNum] = useState(''); // General search query
    const [searchQueryTel, setSearchQueryTel] = useState(''); // Search by phone number
    const [searchQueryAddress, setSearchQueryAddress] = useState(''); // Search by address
    const [searchQueryStatus, setSearchQueryStatus] = useState(''); // Search by status
    const [startDate, setStartDate] = useState(''); // Start date for filtering
    const [endDate, setEndDate] = useState(''); // End date for filtering

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await axios.get('https://api.express.ci/partners/orders', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                });
                const data = response.data;

                const allCommandes = data.data;
                setCommandes(allCommandes);
                setCommandesInProcess(allCommandes.filter(order => order.status.status === 'inprocess'));
                setCanceledCommandes(allCommandes.filter(order => order.status.status === 'canceled'));
                setDelevriedCommandes(allCommandes.filter(order => order.status.status === 'delivered'))
                setPenddingCommandes(allCommandes.filter(order => order.status.status === 'pending'))


                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]); // Add startDate and endDate as dependencies

    const handleSearchChangeNum = (event) => {
        const value = event.target.value;
        setSearchQueryNum(value);
    };

    const handleSearchChangeTel = (event) => {
        setSearchQueryTel(event.target.value.toLowerCase());
    };



    const handleSearchChangeStatus = (event) => {
        setSearchQueryStatus(event.target.value.toLowerCase());
    };


    const filterCommandes = (commandes) => {
        return commandes.filter(commande => {

            const status = commande.status?.status.toLowerCase() || '';
            const createdDate = new Date(commande.createdAt); // Assuming 'createdAt' is the date field
            const start = new Date(startDate);
            const end = new Date(endDate);

            return (
                (searchQueryTel === '' || commande?.delivery?.contact?.phoneNumber.includes(searchQueryTel) ||
                    commande?.user?.phoneNumber.includes(searchQueryTel) ||
                    commande?.pickups?.contact?.phoneNumber.includes(searchQueryTel)

                ) &&
                (searchQueryAddress === '' ||

                    addressName.includes(searchQueryAddress)

                ) &&
                (searchQueryStatus === '' || searchQueryStatus === 'global' || status.includes(searchQueryStatus)) &&
                (searchQueryNum === '' || commande.uuid.includes(searchQueryNum)) &&
                (isNaN(start.getTime()) || createdDate >= start) &&
                (isNaN(end.getTime()) || createdDate <= end)
            );
        });
    };

    const filteredCommandes = filterCommandes(commandes);
    const filteredCommandesInProcess = filterCommandes(commandesInProcess);
    const filteredCanceledCommandes = filterCommandes(canceledCommandes);
    const filtereddelevriedCommandes = filterCommandes(DelevriedCommandes);
    const filteredpenddingCommandes = filterCommandes(penddingCommandes);


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
        <div className='' style={{ marginTop: "5%" , padding:'60px', height: '100vh' }} >

            <form>
                <div className="row mt-4">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Numéro de commande..."
                            value={searchQueryNum}
                            onChange={handleSearchChangeNum}
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Téléphone"
                            value={searchQueryTel}
                            onChange={handleSearchChangeTel}
                        />
                    </div>
                    <div className="col">
                        <select
                            className="form-control"
                            value={searchQueryStatus}
                            onChange={handleSearchChangeStatus}
                        >
                            <option value="" disabled> Status </option>
                            <option value="global"> Tout </option>
                            <option value="inprocess">En cours</option>
                            <option value="delivered">Livrée</option>
                            <option value="pending">En attente</option>
                            <option value="canceled">Annulée</option>
                        </select>
                    </div>
                    <div className="col">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Date de début..."
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Date de fin..."
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col">
                    <a

                        href="/add-commandes"
                        className="btn  btn-success"
                    >
                        créer une commande
                    </a>
                    </div>
                </div>
            </form>
            <div className="row mt-4">
                <div className="col-md-10"></div>
                <div className="col-md-2">
                  
                </div>
                <Tabs
                    defaultActiveKey="list-commandes"
                    id="uncontrolled-tab-example"
                    className="mb-3 justify-content-center"
                >
                    <Tab eventKey="commandes-en-attente"
                         title={`Commandes en attente (${filteredpenddingCommandes.length})`}>
                        {/*<CommandePendingTable commandes={filteredpenddingCommandes}/>*/}
                        <CommandesTable commandes={filteredpenddingCommandes}/>
                    </Tab>
                    <Tab eventKey="commandes-en-cours"
                         title={`Commandes en cours (${filteredCommandesInProcess.length})`}>
                        {/*<CommandesEnCourTable commandes={filteredCommandesInProcess}/>*/}
                        <CommandesTable commandes={filteredCommandesInProcess}/>
                    </Tab>
                    <Tab eventKey="commandes-delevried"
                         title={`Commandes en livrées (${filtereddelevriedCommandes.length})`}>
                        {/*<CommandeDelevriedTable commandes={filtereddelevriedCommandes}/>*/}
                        <CommandesTable commandes={filtereddelevriedCommandes}/>
                    </Tab>
                    <Tab eventKey="commandes-annulees"
                         title={`Commandes annulées (${filteredCanceledCommandes.length})`}>
                        {/*<CommandeeAnnuleesTable commandes={filteredCanceledCommandes}/>*/}
                        <CommandesTable commandes={filteredCanceledCommandes}/>
                    </Tab>
                    <Tab eventKey="list-commandes" title={`Historique commandes (${filteredCommandes.length})`}>
                        <CommandesTable commandes={filteredCommandes}/>
                    </Tab>

                </Tabs>
            </div>
        </div>
    );
}

export default ListCommandes;
