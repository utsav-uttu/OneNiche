import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/Authcontext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;