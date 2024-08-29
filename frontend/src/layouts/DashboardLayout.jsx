import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-grow bg-gray-100 ml-16 ">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
