import React, { useState, useEffect } from 'react';
import './Calendar.scss';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { GW_URL, adminConfig, getIndianDate } from '../../config'; 
import DataLoader from '../../components/Loader/DataLoader';

const EachTeacherAttendanceCalender = ({ teacherId, holidays, holidayListLoading}) => {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [attendanceList, setAttendance] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getHolidayList = (holidays) => {
        const dateRanges = [];
        holidays?.forEach((item) => {
            const startDate = new Date(item.start_date);
            const endDate = new Date(item.end_date);

            // Calculate the number of days between the start_date and end_date
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Create an array of dates between start_date and end_date
            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i + 1);
                dateRanges.push({ date: date.toISOString(), purpose: item.purpose });
            }
        });
        return dateRanges;

    }
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const months2 = [
        "jan", "feb", "march", "april", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"
    ]

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const getAttendance = () => {

        axios.get(`${GW_URL}/teachers/${teacherId}/getTeacherAttendance?month=${month + 1}&year=${year}`, adminConfig).then((res) => {
            let attendanceData = res.data.teacherAttendance;
            console.log(attendanceData);
            let allData = [];
            for(let i = 0; i < attendanceData.length; i++){
                allData.push({...attendanceData[i], is_present: true});
            }
            setAttendance(allData);
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        })
    }
    useEffect(() => {

        getAttendance();
    }, [month, year])

    const IncreaseDateByOne = (date) => {
        const parsedDate = new Date(date);
        // Increasing the date by one day
        parsedDate.setDate(parsedDate.getDate() + 1);
        // Formatting the increased date back into the desired format
        const increasedDate = parsedDate.toISOString().split('T')[0];
        return increasedDate;
    }
    const renderCalendar = () => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const calendar = [];
        let row = [];

        // Add empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            row.push(<div key={`prev-${i}`} className="emptyCell"></div>);
        }
        // Create a holiday date list 
        const holidayDates = getHolidayList(holidays)?.map(holiday => new Date(holiday.date).toISOString().split('T')[0]); 

        // Add cells for current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayOfWeek = new Date(year, month, i).getDay();
            const currentDate = new Date(year, month, i).toISOString().split('T')[0];
            const newIncreaseDate = IncreaseDateByOne(currentDate);

            const attendance = attendanceList?.find(
                (item) => item.attendance_date.split('T')[0] === newIncreaseDate
            );

            const isHoliday = holidayDates.includes(newIncreaseDate); 
            const cellClass =
                (new Date(year, month, i)) > new Date()  // Compare with current date
                    ? isHoliday || dayOfWeek === 0 ? 'cell cell-future cell-holiday'
                        : 'cell cell-future'
                    : isHoliday ? 'cell cell-holiday'
                        : dayOfWeek === 0 ? 'cell cell-holiday'
                            : attendance?.is_present
                                ? 'cell cell-green'
                                : 'cell cell-red';
            const cellContent = isHoliday ? 'Holiday' : i;
            row.push(
                <div  key={`current-${i}`} className={cellClass}>
                    <div className="date">{cellContent}</div>
                    <div className="day">{days[dayOfWeek]}</div>
                </div>
            );

            if (dayOfWeek === 6 || i === daysInMonth) {
                calendar.push(
                    <div key={`row-${calendar.length}`} className="row">
                        {row}
                    </div>
                );
                row = [];
            }
        }
        return calendar;
    };

    if (isLoading || holidayListLoading) { 
        return (
            <div style={{ width: "100%", display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                <DataLoader width={100} Loading={isLoading} />
            </div>
        ); 
    }

    return (
        <div className="calendar">
            <div className="monthYear">
                <select
                    value={month}
                    className='input'
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                >
                    {Array.from({ length: 10 }, (_, i) => year - 5 + i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <div className='button-container'>
                    <button className='btn' onClick={handlePrevMonth}>
                        <ArrowBack />
                    </button>
                    <button className='btn' onClick={handleNextMonth}>
                        <ArrowForwardIcon />
                    </button>
                </div>

            </div>

            <div className="squareBoxOfDay">{renderCalendar()}</div>
        </div>
    );
};

export default EachTeacherAttendanceCalender;
