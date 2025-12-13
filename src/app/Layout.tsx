import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div>
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};
