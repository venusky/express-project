import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
function App() {
    return (
      <RouterProvider router={router} />
    );
}

export default App;