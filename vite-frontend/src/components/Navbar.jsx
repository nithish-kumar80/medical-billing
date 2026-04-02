function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">

      <h2 className="text-lg font-semibold">
        Hospital Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>

        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      </div>

    </div>
  );
}

export default Navbar;