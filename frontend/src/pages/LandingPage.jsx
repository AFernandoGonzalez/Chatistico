

import React from 'react';
import { Link } from 'react-scroll';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-gray-900">
            <section id="home" className="bg-gradient-to-r from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold">
                        AI-Powered Chatbots for Every Business
                    </h1>
                    <p className="mt-6 text-lg font-light max-w-2xl mx-auto">
                        Customize, integrate, and manage your chatbot in minutes. Powered by OpenAI, our solution will help you engage your users more efficiently.
                    </p>
                    <Link to="signup" smooth={true} duration={500}>
                        <button className="mt-8 bg-accent text-primary px-10 py-4 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                            Get Started
                        </button>
                    </Link>
                </div>
            </section>

            <section id="features" className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-center mb-12 text-primary">
                        Why Choose Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <Feature
                            title="Easy Configuration"
                            description="Customize chatbot styles, upload documents, and set up your bot with ease."
                        />
                        <Feature
                            title="OpenAI Integration"
                            description="Leverage the power of OpenAI to provide smart, contextual responses."
                        />
                        <Feature
                            title="Real-time Analytics"
                            description="Track engagement and performance with detailed analytics and reports."
                        />
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="bg-gray-100 py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-center mb-12 text-primary">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <Step
                            number="1"
                            title="Sign Up"
                            description="Create your account and start setting up your chatbot instantly."
                        />
                        <Step
                            number="2"
                            title="Configure"
                            description="Customize the chatbot's appearance, upload documents, and integrate with your data."
                        />
                        <Step
                            number="3"
                            title="Deploy"
                            description="Add the chatbot to your website with a simple embed code. Start interacting with users."
                        />
                    </div>
                </div>
            </section>

            <section id="pricing" className="bg-primary text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold mb-6">Start Building Your Chatbot Today!</h2>
                    <p className="text-lg mb-8 font-light max-w-2xl mx-auto">
                        Join countless businesses using AI-powered chatbots to streamline communication and enhance customer engagement.
                    </p>
                    <Link to="signup" smooth={true} duration={500}>
                        <button className="bg-accent text-primary px-10 py-4 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                            Sign Up Now
                        </button>
                    </Link>
                </div>
            </section>

            <footer className="bg-darkBackground text-white py-6">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2024 Your SaaS Name. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const Feature = ({ title, description }) => (
    <div className="bg-white shadow-lg p-8 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-2xl font-extrabold mb-4 text-primary">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const Step = ({ number, title, description }) => (
    <div className="text-center">
        <div className="text-6xl font-extrabold text-primary mb-4">{number}</div>
        <h3 className="text-2xl font-extrabold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default LandingPage;
