import React from 'react';

const ActivePercentageBadge = ({ percentage }) => {
  // Color coding based on percentage
  let colorClass = 'bg-sage-500 text-white';
  let emoji = '🌟';
  
  if (percentage >= 80) {
    colorClass = 'bg-emerald-600 text-white';
    emoji = '💎';
  } else if (percentage >= 60) {
    colorClass = 'bg-sage-500 text-white';
    emoji = '🌟';
  } else if (percentage >= 40) {
    colorClass = 'bg-amber-500 text-white';
    emoji = '🌿';
  } else {
    colorClass = 'bg-gray-400 text-white';
    emoji = '🍃';
  }

  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${colorClass} shadow-lg text-sm font-bold`}>
      <span>{emoji}</span>
      <span>{percentage}% Active</span>
    </div>
  );
};

export default ActivePercentageBadge;
