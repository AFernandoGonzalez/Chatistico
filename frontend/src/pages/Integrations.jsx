import React, { useState } from 'react';

const Integrations = () => {
    const [selectedType, setSelectedType] = useState('Floating Chat');

    const displayTypes = [
        {
            type: 'Floating Chat',
            description: `<script async data-id="1244177941" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>`
        },
        {
            type: 'Inline',
            description: `<div id="chatling-inline-bot" style="width: 100%; height: 500px;"></div>\n<script async data-id="1244177941" data-display="page_inline" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>`
        },
        {
            type: 'Fullscreen',
            description: `<script async data-id="1244177941" id="chatling-embed-script" data-display="fullscreen" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>`
        }
    ];

    const handleCopyCode = () => {
        const codeToCopy = displayTypes.find(type => type.type === selectedType).description;
        navigator.clipboard.writeText(codeToCopy)
            .then(() => {
                alert('Code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <div className="p-8 bg-white shadow rounded-lg mx-auto flex items-center justify-center">
            <div className="w-full max-w-3xl">

                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Integrate Chatbot to Your Website</h1>
                <p className="mb-8 text-center text-gray-600">Follow the steps below to seamlessly integrate the chatbot into your website.</p>

                {/* Step 1 */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Choose Your Display Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {displayTypes.map((type) => (
                            <button
                                key={type.type}
                                className={`p-6 border-2 rounded-lg hover:bg-gray-100 transition ${selectedType === type.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                onClick={() => setSelectedType(type.type)}
                            >
                                <p className="text-center font-medium text-gray-700">{type.type}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2 */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">2. Copy Your Embed Code</h2>
                    <div className="relative bg-gray-100 p-4 rounded-lg mb-4">
                        <code className="text-sm whitespace-pre-line block">{displayTypes.find(type => type.type === selectedType).description}</code>
                        <button
                            onClick={handleCopyCode}
                            className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        >
                            Copy Code
                        </button>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">3. Add to Your Website's HTML</h2>
                    <p className="mb-4 text-gray-600">
                        Insert the copied code into the head or body section of your website's HTML file.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Integrations;
