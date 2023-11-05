// DateFilter.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateFilter({ selectedStartDate, selectedEndDate, onStartDateChange, onEndDateChange }) {
    return (
        <div>
            <DatePicker
                selected={selectedStartDate}
                onChange={onStartDateChange}
                selectsStart
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                placeholderText="Start Date"
            /> 
            <DatePicker
                selected={selectedEndDate}
                onChange={onEndDateChange}
                selectsEnd
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                placeholderText="End Date"
            />
        </div>
    );
}

export default DateFilter;
