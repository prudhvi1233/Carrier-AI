export const KANBAN_COLUMNS = [
  { id: 'Not Applied', title: 'Saved Jobs' },
  { id: 'Applied', title: 'Applied' },
  { id: 'Interviewing', title: 'Interviewing' },
  { id: 'Offer', title: 'Offers' },
  { id: 'Rejected', title: 'Rejected' }
];

export const STATUS_MAP = {
  'Not Applied': { bg: 'bg-gray-500', border: 'border-gray-400' },
  'Applied': { bg: 'bg-blue-500', border: 'border-blue-400' },
  'Interviewing': { bg: 'bg-yellow-500', border: 'border-yellow-400' },
  'Offer': { bg: 'bg-green-500', border: 'border-green-400' },
  'Rejected': { bg: 'bg-red-500', border: 'border-red-400' }
};

export const mockTrackerAnalytics = {
  applicationsPerMonth: [
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 7 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 18 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 8 }
  ],
  interviewRate: [
    { name: 'Applied', value: 64, fill: '#6b7280' },
    { name: 'Screening', value: 24, fill: '#3b82f6' },
    { name: 'Interview', value: 12, fill: '#eab308' },
    { name: 'Offer', value: 4, fill: '#22c55e' }
  ]
};
