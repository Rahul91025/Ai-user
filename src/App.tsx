import React, { useState, useEffect } from 'react';
import { Clock, Users, Timer, AlertCircle, Calendar, ArrowRight, Building2, Clock3, MapPin, Phone, Globe, Shield, CreditCard } from 'lucide-react';
import { Person, QueueStats, Bank } from './types';
import { calculateQueueStats, formatTime, banks, bankQueues } from './utils';

function App() {
  const [selectedBank, setSelectedBank] = useState<Bank>(banks[0]);
  const [queue, setQueue] = useState<Person[]>(bankQueues[banks[0].id]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<QueueStats>({
    totalWaitTime: 0,
    position: 0,
    possibilityStatus: 'green',
    message: '',
    estimatedCompletionTime: new Date(),
  });

  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setStats(calculateQueueStats(queue, currentTime));
  }, [queue, currentTime]);

  // Update queue when bank changes
  useEffect(() => {
    setQueue(bankQueues[selectedBank.id]);
  }, [selectedBank]);

  const statusGradients = {
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Bank Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="bank-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Nearest Bank Branch
              </label>
              <select
                id="bank-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const bank = banks.find(b => b.id === e.target.value);
                  if (bank) {
                    setSelectedBank(bank);
                    setSelectedPerson(null); // Reset selected person when bank changes
                  }
                }}
                value={selectedBank.id}
              >
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name} - {bank.branch}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowBankDetails(!showBankDetails)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {showBankDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {/* Bank Details */}
          {showBankDetails && (
            <div className="mt-6 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{selectedBank.name} - {selectedBank.branch}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <p className="text-gray-600">{selectedBank.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">{selectedBank.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">IFSC: {selectedBank.ifsc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-600">Working Hours: {selectedBank.workingHours}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Available Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBank.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Services
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBank.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-64 bg-cover bg-center relative" style={{
            backgroundImage: `url("${selectedBank.image}")`
          }}>
            <div className="absolute inset-0 ">
              <div className="h-full flex flex-col justify-center px-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Building2 className="w-10 h-10 text-white" />
                  <h1 className="text-4xl font-bold text-white">Bank Queue Navigator</h1>
                </div>
                <p className="text-white max-w-2xl">
                  Check your estimated wait time and service possibility based on the current queue status.
                  Our smart calculator helps you plan your visit efficiently.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Clock3 className="w-5 h-5 text-blue-200" />
                  <span>Bank Hours: {selectedBank.workingHours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-200" />
                  <span>Current Queue: {queue.length} people</span>
                </div>
              </div>
              <div className="text-lg font-semibold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Your Position</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.position}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Timer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wait Time</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalWaitTime} mins</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Completion</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(stats.estimatedCompletionTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`rounded-xl overflow-hidden shadow-lg`}>
              <div className={`bg-gradient-to-r ${statusGradients[stats.possibilityStatus]} p-6`}>
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">Service Status</h3>
                    <p className="text-white/90 text-lg">{stats.message}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4">
                <p className="text-gray-600">
                  {stats.possibilityStatus === 'green' && "You'll be served today with plenty of time to spare."}
                  {stats.possibilityStatus === 'yellow' && "You might be served today, but please arrive soon."}
                  {stats.possibilityStatus === 'red' && "Unfortunately, there might not be enough time to serve you today."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Queue List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Current Queue Status</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {queue.map((person, index) => (
                <div
                  key={person.id}
                  className={`p-4 flex justify-between items-center hover:bg-blue-50 transition-colors duration-200 cursor-pointer ${
                    selectedPerson === person.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPerson(selectedPerson === person.id ? null : person.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">Person {person.id}</span>
                      {selectedPerson === person.id && (
                        <div className="text-sm text-gray-500 mt-1">
                          Estimated start: {formatTime(new Date(currentTime.getTime() + (index * 15 * 60000)))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{person.averageTime} mins</span>
                    <ArrowRight className={`w-4 h-4 text-blue-500 transition-transform duration-200 ${
                      selectedPerson === person.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;