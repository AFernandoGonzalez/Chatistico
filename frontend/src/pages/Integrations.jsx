import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faGlobe, faCode, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Integrations = () => {
    const { id: chatbotId } = useParams();
    const [selectedType, setSelectedType] = useState('Floating Chat');
    const apiBaseUrl = import.meta.env.VITE_EMBED_URL;

    const displayTypes = [
        {
            type: 'Floating Chat',
            description: `<script async data-widget-id="${chatbotId}" id="embed-script" type="text/javascript" src="${apiBaseUrl}/js/widgetLoader.js"></script>`
        },
        {
            type: 'Inline',
            description: `<script async data-widget-id="${chatbotId}" data-display="page_inline" id="embed-script" type="text/javascript" src="${apiBaseUrl}/js/widgetLoader.js"></script>`
        },
        {
            type: 'Fullscreen',
            description: `<script async data-widget-id="${chatbotId}" id="embed-script" data-display="fullscreen" type="text/javascript" src="${apiBaseUrl}/js/widgetLoader.js"></script>`
        }
    ];

    const handleCopyCode = () => {
        const codeToCopy = displayTypes.find(type => type.type === selectedType).description;
        navigator.clipboard.writeText(codeToCopy)
            .then(() => {
                toast.success('Code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <div className="p-8 bg-gray-100 rounded-lg mx-auto flex items justify-center">
            <div className="w-full max-w-3xl">

                <h1 className="text-xl font-bold mb-8 text- text-gray-900">Integrate Chatbot with Your Website</h1>
                <p className="mb-10 text-lg  text-gray-600">
                    Follow the steps below to seamlessly integrate the chatbot into your website.
                    <FontAwesomeIcon icon={faQuestionCircle} className="ml-2 text-gray-400" data-tip="Select your display type, copy the code, and paste it into your website's HTML." />

                </p>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Choose Your Display Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayTypes.map((type) => (
                            <button
                                key={type.type}
                                className={`p-6 border-2 rounded-lg hover:bg-gray-200 transition ${selectedType === type.type ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
                                onClick={() => setSelectedType(type.type)}
                            >
                                <div className="flex flex-col items-center">
                                    <FontAwesomeIcon icon={faGlobe} className="text-gray-600 mb-2 text-2xl" />
                                    <p className=" text-lg font-medium text-gray-700">{type.type}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Copy Your Embed Code</h2>
                    <div className="relative bg-gray-100 p-6 rounded-lg mb-4 border border-gray-300">
                        <code className="text-sm text-gray-800 block overflow-x-auto break-words">{displayTypes.find(type => type.type === selectedType).description}</code>
                    </div>
                    <div className='relative'>
                        <button
                            onClick={handleCopyCode}
                            className="right-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                        >
                            <FontAwesomeIcon icon={faCopy} className="mr-2" /> Copy Code
                        </button>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Add to Your Website's HTML</h2>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                        Insert the copied code into the head or body section of your website's HTML file. For best performance, place it right before the closing <code className="text-red-500">&lt;/body&gt;</code> tag.
                    </p>
                    <div className="flex items-center justify-center mt-6">
                        <FontAwesomeIcon icon={faCode} className="text-4xl text-blue-500" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Integrations;
