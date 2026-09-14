import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calendar, Clock, Home, Download, Phone, MessageCircle, CheckCircle } from 'lucide-react';

export const TripScheduleModal = () => {
  const { isTripModalOpen, setIsTripModalOpen, tripSchedule, setTripSchedule, showToast } = useStore();

  // Generate date options for the next 14 days
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const fullDay = d.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedStr = `${dayName}, ${dayNum} ${monthName}`;
      
      dates.push({
        value: d.toISOString().split('T')[0],
        label: formattedStr,
        dayNum,
        monthName,
        year: d.getFullYear(),
        dayName: fullDay,
        isToday: i === 0
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  // Local form state initialized from store or defaults
  const [selectedDateVal, setSelectedDateVal] = useState(tripSchedule?.startDate || dateOptions[0].value);
  const [selectedHour, setSelectedHour] = useState(tripSchedule?.startHour || '09');
  const [selectedMinute, setSelectedMinute] = useState(tripSchedule?.startMinute || '00');
  const [selectedAmpm, setSelectedAmpm] = useState(tripSchedule?.startAmpm || 'AM');
  const [activeTab, setActiveTab] = useState('start'); // 'start' or 'end'

  // End date default state (e.g. +1 day or same day)
  const [selectedEndDateVal, setSelectedEndDateVal] = useState(tripSchedule?.endDate || dateOptions[0].value);

  if (!isTripModalOpen) return null;

  const currentStartDateObj = dateOptions.find(d => d.value === selectedDateVal) || dateOptions[0];
  const currentEndDateObj = dateOptions.find(d => d.value === selectedEndDateVal) || dateOptions[0];

  const handleSave = () => {
    const formattedStartTime = `${selectedHour}:${selectedMinute} ${selectedAmpm}`;
    const newSchedule = {
      startDate: selectedDateVal,
      startDateLabel: `${currentStartDateObj.dayNum} ${currentStartDateObj.monthName} ${currentStartDateObj.year}`,
      startDay: currentStartDateObj.dayName,
      startTime: formattedStartTime,
      startHour: selectedHour,
      startMinute: selectedMinute,
      startAmpm: selectedAmpm,
      endDate: selectedEndDateVal,
      endDateLabel: `${currentEndDateObj.dayNum} ${currentEndDateObj.monthName} ${currentEndDateObj.year}`,
      endDay: currentEndDateObj.dayName,
    };
    setTripSchedule(newSchedule);
    setIsTripModalOpen(false);
    showToast(`Trip schedule set: ${newSchedule.startDateLabel}, ${newSchedule.startTime} 🚗`);
  };

  return (
    <div className="modal-backdrop trip-modal-backdrop">
      <div className="trip-modal-card">
        {/* Close Button */}
        <button 
          className="trip-modal-close" 
          onClick={() => setIsTripModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="trip-modal-title">Select Trip Start Date & Time</h2>

        {/* TODAY Indicator */}
        <div className="today-badge-text">
          {currentStartDateObj.isToday ? 'TODAY' : currentStartDateObj.dayName.toUpperCase()}
        </div>

        {/* Picker Dropdowns Row */}
        <div className="picker-dropdowns-row">
          {/* Date Selector */}
          <div className="select-pill-wrapper date-pill">
            <select
              value={selectedDateVal}
              onChange={(e) => setSelectedDateVal(e.target.value)}
              className="pill-select"
            >
              {dateOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="select-chevron">▼</span>
          </div>

          {/* Hour Selector */}
          <div className="select-pill-wrapper hour-pill">
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="pill-select"
            >
              {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="select-chevron">▼</span>
          </div>

          <span className="time-colon">:</span>

          {/* Minute Selector */}
          <div className="select-pill-wrapper min-pill">
            <select
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              className="pill-select"
            >
              {['00','15','30','45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <span className="select-chevron">▼</span>
          </div>

          {/* AM / PM Selector */}
          <div className="select-pill-wrapper ampm-pill">
            <select
              value={selectedAmpm}
              onChange={(e) => setSelectedAmpm(e.target.value)}
              className="pill-select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <span className="select-chevron">▼</span>
          </div>
        </div>

        {/* Selection Cards (Trip Start vs Trip End) */}
        <div className="trip-cards-grid">
          {/* Trip Start Card */}
          <div 
            className={`trip-summary-card ${activeTab === 'start' ? 'active-card' : ''}`}
            onClick={() => setActiveTab('start')}
          >
            <div className="card-header-label start-label">TRIP START</div>
            <div className="card-datetime-val">
              {currentStartDateObj.dayNum} {currentStartDateObj.monthName} {currentStartDateObj.year}, {parseInt(selectedHour, 10)}:{selectedMinute} {selectedAmpm}
            </div>
            <div className="card-day-val">{currentStartDateObj.dayName}</div>
          </div>

          {/* Trip End Card */}
          <div 
            className={`trip-summary-card ${activeTab === 'end' ? 'active-card' : ''}`}
            onClick={() => setActiveTab('end')}
          >
            <div className="card-header-label end-label">TRIP END</div>
            <div className="card-datetime-val">
              {currentEndDateObj.dayNum} {currentEndDateObj.monthName} {currentEndDateObj.year}
            </div>
            <div className="card-day-val">{currentEndDateObj.dayName}</div>
          </div>
        </div>

        {/* Action Button */}
        <button className="confirm-trip-btn" onClick={handleSave}>
          Confirm Trip Schedule
        </button>
      </div>

      {/* Floating Bottom Navigation Bar matching original screenshot */}
      <div className="bottom-nav-bar">
        <button className="nav-item">
          <div className="nav-icon-circle green">
            <Home size={20} />
          </div>
          <span>Home</span>
        </button>

        <button className="nav-item">
          <div className="nav-icon-circle orange">
            <Download size={20} />
          </div>
          <span>Install App</span>
        </button>

        <button className="nav-item">
          <div className="nav-icon-circle phone-orange">
            <Phone size={20} />
          </div>
          <span>Call</span>
        </button>

        <button className="nav-item">
          <div className="nav-icon-circle whatsapp-green">
            <MessageCircle size={20} />
          </div>
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
