// import React , {useEffect , useState} from 'react';
// import { Outlet } from 'react-router-dom';
// import Nav from 'react-bootstrap/Nav';
// import './nav.css';
// import axios from 'axios';

// function Index() {
//   const [balance, setBalance] = useState();
//   useEffect(() => {
//     // Fetch data
//     const fetchData = async () => {
//         try {
//             const response = await axios.get('https://api.express.ci/partners/wallet/balance', {
//                 headers: {
//                     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6IisyMjU5OTAwMDAwMDAyIiwidG9rZW5WZXJzaW9uIjoxNzI1MjIzMjMyODI5LCJpYXQiOjE3MjUyMjMyMzJ9.U78xHWtSuB89mqgzjM0czVswgHli-RGSne6LkxwTLmk' // Replace with your actual token
//                 }
//             });
//             setBalance(response.data.balance)
  

//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     fetchData();
// }, []); 
// const logout=()=>{
//   localStorage.removeItem('token')
//   window.location.href='/login'
// }
// const formatNumber = (number) => {
//   return new Intl.NumberFormat('fr-FR').format(number);
// };// Empty dependency array means this effect runs only once

//   return (
//     <div>
//       <header className='mt-4'>
//         <Nav className="justify-content-center navbar">
//           <Nav.Item>
//             <Nav.Link>
//               <div className="navbar-logo">
//                 <img
//                   src="https://placehold.co/720/000000/FFF?text=XP&font=Inter"
//                   alt="Express Logo"
//                 />
//                 <div className="express">EXPRESS</div>
//               </div>
//             </Nav.Link>
//           </Nav.Item>

//           <div className="navbar-links-container ">
//             <ul className="navbar-links mt-3">
//               <li className="navbar-link">
//                 <a href="/dashboard">Tableau de Bord</a>
//               </li>
//               <li className="navbar-link">
//                 <a href="liste-commandes">Commandes</a>
//               </li>
//               <li className="navbar-link">
//                 <a href="#">Transactions</a>
//               </li>
//               <li className="navbar-link">
//                 <a href="#">Paramètres</a>
//               </li>
//               <li className="navbar-link">
//                 <a href="" onClick={logout()}>Déconnexion</a>
//               </li>
//             </ul>
//           </div>

//           <div className="wallet-balance-container">
//             <span className="wallet-balance-label">Portefeuille</span>
//             <span className="wallet-balance">{formatNumber(balance)} ₣</span>
//           </div>
//         </Nav>
//       </header>
//       <main>
//         <Outlet />
//       </main>
//       <footer>
//         {/* Footer content */}
//       </footer>
//     </div>
//   );
// }

// export default Index;

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import Header from "./header";

function Index() {


  return (
      <>
        <main >
            <Header />
          <Outlet/>
        </main>
      </>
  );
}

export default Index;

