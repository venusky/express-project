// import { createBrowserRouter } from "react-router-dom";
// import ListCommandes from '../Commandes/List';
// import Index from "../layouts";
// import DetailCommande from "../Commandes/Detail";
// import EditCommande from '../Commandes/Edit';
// import AddCommande from '../Commandes/Add';
// import Dashboard from '../Dashboard';
// import Login from "../login";

// export const router = createBrowserRouter([
//     {
//         path: '/login',
//         element: <Login />,
//     },
//     {
//         element: <Index />, // Index layout will be used for the following routes
//         children: [
//             {
//                 path: 'liste-commandes',
//                 element: <ListCommandes />
//             },
//             {
//                 path: 'add-commandes',
//                 element: <AddCommande />
//             },
//             {
//                 path: 'commande/:id',
//                 element: <DetailCommande />
//             },
//             {
//                 path: 'commande/edit/:id',
//                 element: <EditCommande />
//             },
//             {
//                 path: 'dashboard',
//                 element: <Dashboard />
//             },
//         ]
//     },
// ]);


import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider, Route, Navigate } from 'react-router-dom';
import ListCommandes from '../Commandes/List';
import Index from '../layouts';
import DetailCommande from '../Commandes/Detail';
import EditCommande from '../Commandes/Edit';
import AddCommande from '../Commandes/Add';
import Dashboard from '../Dashboard';
import Login from '../login';

// Hook for authentication check
const useAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Protected route component
const ProtectedRoute = ({ element }) => {
    const isAuthenticated = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
};

// Create the router with protected routes
export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        element: <Index />, // Index layout will be used for the following routes
        children: [
            {
                path: 'liste-commandes',
                element: <ProtectedRoute element={<ListCommandes />} />
            },
            {
                path: 'add-commandes',
                element: <ProtectedRoute element={<AddCommande />} />
            },
            {
                path: 'commande/:id',
                element: <ProtectedRoute element={<DetailCommande />} />
            },
            {
                path: 'commande/edit/:id',
                element: <ProtectedRoute element={<EditCommande />} />
            },
            {
                path: 'dashboard',
                element: <ProtectedRoute element={<Dashboard />} />
            },
            {
                path: '*',
                element: <Navigate to="/login" />
            }
        ]
    },
]);


