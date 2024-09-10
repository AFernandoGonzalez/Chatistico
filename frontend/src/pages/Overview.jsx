import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserPlus, faClock, faSmile } from '@fortawesome/free-solid-svg-icons';

export const Overview = () => {
  const data = {
    conversations: 150,
    leads: 50,
    responseTime: 2.3,
    satisfaction: 85,
    peakTimes: [
      { hour: '2 PM', value: 30 },
      { hour: '3 PM', value: 50 },
      { hour: '4 PM', value: 40 },
    ],
  };

  return (
    <div className="w-full bg-background py-8">
      <div className="content-wrapper max-w-screen-xl mx-auto p-6">
        {/* Stats Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faComments} className="text-blue-600 mr-3 text-2xl" />
              <h2 className="text-lg text-gray-700 font-semibold">New Conversations</h2>
            </div>
            <div className="text-5xl font-bold text-blue-600">{data.conversations}</div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faUserPlus} className="text-green-600 mr-3 text-2xl" />
              <h2 className="text-lg text-gray-700 font-semibold">New Contacts & Leads</h2>
            </div>
            <div className="text-5xl font-bold text-green-600">{data.leads}</div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faClock} className="text-purple-600 mr-3 text-2xl" />
              <h2 className="text-lg text-gray-700 font-semibold">Avg. AI Response Time (s)</h2>
            </div>
            <div className="text-5xl font-bold text-purple-600">{data.responseTime}</div>
          </div>
        </div>

        {/* Customer Satisfaction & Peak Times */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
          <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faSmile} className="text-yellow-500 mr-3 text-2xl" />
              <h2 className="text-lg text-gray-700 font-semibold">Customer Satisfaction</h2>
            </div>
            <div className="text-5xl font-bold text-yellow-500">{data.satisfaction}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${data.satisfaction}%` }}></div>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg text-gray-700 font-semibold mb-3">Peak User Engagement Times</h2>
            <div className="space-y-2">
              {data.peakTimes.map((time, index) => (
                <div key={index} className="text-gray-700">
                  <span className="font-bold text-gray-800">{time.hour}:</span> {time.value} interactions
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
