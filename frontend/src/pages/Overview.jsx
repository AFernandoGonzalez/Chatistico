import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserPlus, faClock, faSmile } from '@fortawesome/free-solid-svg-icons';

export const Overview = () => {
  const data = {
    conversations: 150,
    leads: 50,
    responseTime: 2.3, // in seconds
    satisfaction: 85, // percentage
    peakTimes: [
      { hour: '2 PM', value: 30 },
      { hour: '3 PM', value: 50 },
      { hour: '4 PM', value: 40 },
    ],
  };

  return (
    <div className="w-full relative">
      <div className="content-wrapper max-w-screen-xl mx-auto bg-gray-100 p-6 ">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faComments} className="text-blue-500 mr-2" />
              <div className="text-gray-600 font-medium">New Conversations</div>
            </div>
            <div className="text-4xl font-bold text-blue-600">{data.conversations}</div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faUserPlus} className="text-green-500 mr-2" />
              <div className="text-gray-600 font-medium">New Contacts & Leads</div>
            </div>
            <div className="text-4xl font-bold text-green-600">{data.leads}</div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faClock} className="text-purple-500 mr-2" />
              <div className="text-gray-600 font-medium">Avg. AI Response Time (s)</div>
            </div>
            <div className="text-4xl font-bold text-purple-600">{data.responseTime}</div>
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-5">
          <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faSmile} className="text-yellow-500 mr-2" />
              <div className="font-semibold text-xl text-gray-700">Customer Satisfaction</div>
            </div>
            <div className="text-4xl font-bold text-yellow-500">{data.satisfaction}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${data.satisfaction}%` }}></div>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
            <div className="font-semibold text-xl text-gray-700 mb-3">Peak User Engagement Times</div>
            <div className="space-y-2">
              {data.peakTimes.map((time, index) => (
                <div key={index} className="text-gray-600">
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
