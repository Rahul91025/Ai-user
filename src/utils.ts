import { Person, QueueStats, Bank } from './types';

export const calculateQueueStats = (queue: Person[], currentTime: Date): QueueStats => {
  const totalWaitTime = queue.reduce((acc, person) => acc + person.averageTime, 0);
  const position = queue.length + 1;
  
  // Bank closes at 4 PM (16:00)
  const closingTime = new Date(currentTime);
  closingTime.setHours(16, 0, 0, 0);
  
  // Calculate remaining time until closing in minutes
  const remainingTime = (closingTime.getTime() - currentTime.getTime()) / (1000 * 60);
  
  // Calculate estimated completion time
  const estimatedCompletionTime = new Date(currentTime.getTime() + (totalWaitTime * 60000));
  
  let status: 'red' | 'yellow' | 'green';
  let message: string;
  
  if (remainingTime <= 0) {
    status = 'red';
    message = 'Bank is closed';
  } else if (totalWaitTime > remainingTime) {
    status = 'red';
    message = 'Not possible today';
  } else if (totalWaitTime > remainingTime * 0.75) {
    status = 'yellow';
    message = 'Cutting it close';
  } else {
    status = 'green';
    message = 'Yes, possible today';
  }
  
  return {
    totalWaitTime,
    position,
    possibilityStatus: status,
    message,
    estimatedCompletionTime
  };
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Static queue data for each bank
export const bankQueues: Record<string, Person[]> = {
  'sbi-main': [
    { id: 1, averageTime: 15 },
    { id: 2, averageTime: 20 },
    { id: 3, averageTime: 12 },
    { id: 4, averageTime: 18 },
  ],
  'canara-cp': [
    { id: 1, averageTime: 10 },
    { id: 2, averageTime: 25 },
    { id: 3, averageTime: 15 },
  ],
  'union-rajouri': [
    { id: 1, averageTime: 20 },
    { id: 2, averageTime: 15 },
    { id: 3, averageTime: 20 },
    { id: 4, averageTime: 10 },
    { id: 5, averageTime: 15 },
  ],
};

export const banks: Bank[] = [
  {
    id: 'sbi-main',
    name: 'State Bank of India',
    branch: 'Main Branch',
    address: '11/48, Connaught Place, New Delhi - 110001',
    features: ['24/7 ATM', 'Locker Facility', 'Foreign Exchange', 'Digital Banking'],
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&q=80',
    ifsc: 'SBIN0000691',
    phone: '011-23374390',
    workingHours: '9:00 AM - 4:00 PM',
    services: ['Personal Banking', 'Corporate Banking', 'Loans', 'Insurance']
  },
  {
    id: 'canara-cp',
    name: 'Canara Bank',
    branch: 'Connaught Place',
    address: 'P-19, Connaught Circus, New Delhi - 110001',
    features: ['Safe Deposit Locker', 'RTGS/NEFT', 'Demat Services'],
    image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?auto=format&fit=crop&q=80',
    ifsc: 'CNRB0000209',
    phone: '011-23731323',
    workingHours: '9:00 AM - 4:00 PM',
    services: ['Retail Banking', 'MSME Loans', 'Agriculture Finance']
  },
  {
    id: 'union-rajouri',
    name: 'Union Bank',
    branch: 'Rajouri Garden',
    address: 'A-12, Rajouri Garden, New Delhi - 110027',
    features: ['Cash Deposit Machine', 'Passbook Printing', 'Internet Banking'],
    image: 'https://images.unsplash.com/photo-1616486788371-62d930495c44?auto=format&fit=crop&q=80',
    ifsc: 'UBIN0531529',
    phone: '011-25410656',
    workingHours: '9:00 AM - 4:00 PM',
    services: ['NRI Services', 'Trade Finance', 'Digital Banking']
  }
];