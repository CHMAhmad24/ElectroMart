import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import { FaRegEdit } from "react-icons/fa";
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ isOpen, setIsOpen }) => {
    
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <div className={`fixed pt-35 lg:pt-25 h-screen bg-blue-50 border-blue-200 z-40 transition-all duration-300 ease-in-out p-6 w-[280px] right-0 border-l
            ${isOpen ? "translate-x-0" : "translate-x-full"} 
            lg:left-0 lg:right-auto lg:translate-x-0 lg:border-r lg:border-l-0
        `}>
            <div className='space-y-6'>
                <div className="px-4 mb-4">
                    <h1 className="text-3xl font-black text-blue-600">ElectroMart</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Panel</p>
                </div>

                <nav className='space-y-1'>
                    <NavItem to="/dashboard/sales" icon={<LayoutDashboard size={20}/>} label="Sales" onClick={handleNavClick} />
                    <NavItem to="/dashboard/add-product" icon={<PackagePlus size={20}/>} label="Add Product" onClick={handleNavClick} />
                    <NavItem to="/dashboard/products" icon={<PackageSearch size={20}/>} label="Products" onClick={handleNavClick} />
                    <NavItem to="/dashboard/users" icon={<Users size={20}/>} label="Users" onClick={handleNavClick} />
                    <NavItem to="/dashboard/orders" icon={<FaRegEdit size={20}/>} label="Orders" onClick={handleNavClick} />
                </nav>
            </div>
        </div>
    )
}

const NavItem = ({ to, icon, label, onClick }) => (
    <NavLink 
        to={to} 
        onClick={onClick}
        className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200
            ${isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "text-blue-900 hover:bg-blue-100 opacity-70 hover:opacity-100"}
        `}
    >
        {icon}
        <span className="text-[15px]">{label}</span>
    </NavLink>
)

export default Sidebar