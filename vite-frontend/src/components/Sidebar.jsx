import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, Calendar, Pill, Package } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  let menu = [];

  if (user?.role === "admin") {
    menu = [
      { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
      { name: "Patients", path: "/patients", icon: <Users size={18} /> },
      { name: "Add Patient", path: "/add-patient", icon: <Users size={18} /> },
      { name: "Claims", path: "/claims", icon: <FileText size={18} /> },
      { name: "Inventory Requests", path: "/inventory-requests", icon: <Package size={18} /> },
    ];
  }

  if (user?.role === "doctor") {
    menu = [
      { name: "Dashboard", path: "/doctor-dashboard", icon: <Home size={18} /> },
      { name: "Prescriptions", path: "/prescriptions", icon: <Pill size={18} /> },
      { name: "Inventory Requests", path: "/inventory-requests", icon: <Package size={18} /> },
    ];
  }

  if (user?.role === "patient") {
    menu = [
      { name: "My Portal", path: "/patient-portal", icon: <Calendar size={18} /> },
    ];
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <h1 className="text-xl font-bold p-4 text-blue-600 border-b">
        🏥 Hospital System
      </h1>

      <nav className="flex flex-col space-y-1 p-4 flex-1">
        {menu.map((item, i) => (
          <Link key={i} to={item.path}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === item.path ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}>
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-gray-400 text-center">v2.0 — IP Module</p>
      </div>
    </div>
  );
}

export default Sidebar;