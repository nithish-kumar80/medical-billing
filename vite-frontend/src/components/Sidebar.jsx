import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, Activity, Calendar } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <Home /> },
    { name: "Patients", path: "/patients", icon: <Users /> },
    { name: "Add Patient", path: "/add-patient", icon: <Users /> },
    { name: "Add Visit", path: "/add-visit", icon: <Activity /> },
    { name: "Claims", path: "/claims", icon: <FileText /> },

    // ✅ ADD THIS LINE
    { name: "Appointment", path: "/appointment", icon: <Calendar /> },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <h1 className="text-xl font-bold p-4 text-blue-600">
        Hospital System
      </h1>

      <nav className="flex flex-col space-y-2 p-4">
        {menu.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
              location.pathname === item.path
                ? "bg-blue-200"
                : ""
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;