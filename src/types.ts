export interface Person {
  id: number;
  averageTime: number; // in minutes
}

export interface QueueStats {
  totalWaitTime: number;
  position: number;
  possibilityStatus: 'red' | 'yellow' | 'green';
  message: string;
  estimatedCompletionTime: Date;
}

export interface Bank {
  id: string;
  name: string;
  branch: string;
  address: string;
  features: string[];
  image: string;
  ifsc: string;
  phone: string;
  workingHours: string;
  services: string[];
}