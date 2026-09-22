import React from 'react';

const AGE_TABS = [
  { id: 'all', label: 'Tất cả độ tuổi', emoji: '🎈' },
  { id: '0-12m', label: 'Sơ sinh (0 - 12 tháng)', emoji: '🍼' },
  { id: '1-3y', label: 'Tập đi (1 - 3 tuổi)', emoji: '🧸' },
  { id: '3-6y', label: 'Mẫu giáo (3 - 6 tuổi)', emoji: '🎨' },
  { id: '6y+', label: 'Tiểu học (Trên 6 tuổi)', emoji: '🚀' },
];

const AgeFilterBar = ({ selectedAge, onSelectAge }) => {
  return (
    <div className="age-filter-bar">
      {AGE_TABS.map((tab) => (
        <button
          key={tab.id}
          className={`age-tab-btn ${selectedAge === tab.id ? 'active' : ''}`}
          onClick={() => onSelectAge(tab.id)}
        >
          <span>{tab.emoji}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AgeFilterBar;
