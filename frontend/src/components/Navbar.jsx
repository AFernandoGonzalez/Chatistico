

import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isLandingPage = location.pathname === "/";


    return (
        <nav className="bg-primary text-white sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <button 
                >
                    Chatistico
                    <RouterLink to="/" className="hidden md:block">
                    </RouterLink>
                </button>

                {/* Mobile Hamburger Icon */}
                <div className="md:hidden" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-2xl cursor-pointer" />
                </div>




                {isLandingPage && (
                    <ul className={`hidden md:flex space-x-8 items-center`}>
                        <li>
                            <ScrollLink to="home" smooth={true} duration={500} className="hover:text-accent cursor-pointer">
                                Home
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="features" smooth={true} duration={500} className="hover:text-accent cursor-pointer">
                                Features
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="how-it-works" smooth={true} duration={500} className="hover:text-accent cursor-pointer">
                                How It Works
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="pricing" smooth={true} duration={500} className="hover:text-accent cursor-pointer">
                                Pricing
                            </ScrollLink>
                        </li>
                    </ul>
                )}
                {/* Get Started Button (visible on all screens) */}
                <RouterLink to="/signup" className="hidden md:block">
                    <button className="bg-accent text-primary px-6 py-2 font-bold rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
                        Get Started
                    </button>
                </RouterLink>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-6 py-4">
                    <ul className="space-y-4">
                        <li>
                            <ScrollLink to="home" smooth={true} duration={500} className="block text-lg hover:text-accent cursor-pointer" onClick={toggleMenu}>
                                Home
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="features" smooth={true} duration={500} className="block text-lg hover:text-accent cursor-pointer" onClick={toggleMenu}>
                                Features
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="how-it-works" smooth={true} duration={500} className="block text-lg hover:text-accent cursor-pointer" onClick={toggleMenu}>
                                How It Works
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="pricing" smooth={true} duration={500} className="block text-lg hover:text-accent cursor-pointer" onClick={toggleMenu}>
                                Pricing
                            </ScrollLink>
                        </li>
                        <li>
                            <RouterLink to="/signup" className="block text-lg hover:text-accent" onClick={toggleMenu}>
                                Get Started
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
