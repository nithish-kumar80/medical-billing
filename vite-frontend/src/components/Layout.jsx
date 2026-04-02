import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h1 className="text-xl font-bold">🏥 Med System</h1>

        <nav className="space-y-2">
          <Link to="/" className="block hover:text-blue-400">Dashboard</Link>
          <Link to="/patients" className="block hover:text-blue-400">Patients</Link>
          <Link to="/add-patient" className="block hover:text-blue-400">Add Patient</Link>
          <Link to="/search" className="block hover:text-blue-400">Search</Link>
          <Link to="/claims" className="block hover:text-blue-400">Claims</Link>
            <Link to="/appointment" className="block hover:text-blue-400">Appointment</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default Layout;