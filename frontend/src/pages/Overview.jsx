import React from 'react';

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
      <div className="content-wrapper max-w-screen-xl mx-auto bg-white">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg  bg-white">
            <div className="text-gray-500 font-medium">New Conversations</div>
            <div className="text-3xl font-bold">{data.conversations}</div>
          </div>
          <div className="p-6 rounded-lg  bg-white">
            <div className="text-gray-500 font-medium">New Contacts & Leads</div>
            <div className="text-3xl font-bold">{data.leads}</div>
          </div>
          <div className="p-6 rounded-lg bg-white">
            <div className="text-gray-500 font-medium">Avg. AI Response Time (s)</div>
            <div className="text-3xl font-bold">{data.responseTime}</div>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 mt-5">
          <div className="p-6 rounded-lg  bg-white">
            <div className="font-semibold text-xl mb-5">Customer Satisfaction</div>
            <div className="text-3xl font-bold">{data.satisfaction}%</div>
          </div>
          <div className="p-6 rounded-lg  bg-white">
            <div className="font-semibold text-xl mb-5">Peak User Engagement Times</div>
            <div className="space-y-2">
              {data.peakTimes.map((time, index) => (
                <div key={index} className="text-gray-500">
                  {time.hour}: {time.value} interactions
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
