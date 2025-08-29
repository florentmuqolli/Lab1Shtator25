import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasEvent = (day) => {
    
    return day === 15 || day === 20 || day === 25 || day === 8;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayHasEvent = hasEvent(day);
      const today = isToday(day);
      const selected = isSelected(day);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${today ? 'today' : ''} ${selected ? 'selected' : ''} ${dayHasEvent ? 'has-event' : ''}`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          <span className="day-number">{day}</span>
          {dayHasEvent && <div className="event-dot"></div>}
        </div>
      );
    }

    return days;
  };

  const events = [
    { time: "10:00 - 11:30", name: "Mathematics Class", location: "Room 203", color: "#3498db" },
    { time: "14:00 - 15:30", name: "Physics Lab", location: "Science Building", color: "#00B894" },
    { time: "16:00 - 17:00", name: "Study Group", location: "Library", color: "#FD79A8" }
  ];

  return (
    <div className="bg-light min-vh-100">
      {}
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">Calendar</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h5>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigateMonth(-1)}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigateMonth(1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>

                {}
                <div className="calendar-week-days mb-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="week-day-header">
                      {day}
                    </div>
                  ))}
                </div>

                {}
                <div className="calendar-grid">
                  {generateCalendarDays()}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">
                    {selectedDate.toDateString() === new Date().toDateString() 
                      ? "Today's Events" 
                      : `Events on ${selectedDate.toLocaleDateString()}`
                    }
                  </h5>
                  <Badge bg="primary" className="px-3 py-2">
                    {events.length} Events
                  </Badge>
                </div>

                {events.length > 0 ? (
                  <div className="events-list">
                    {events.map((event, index) => (
                      <div key={index} className="event-item mb-3 p-3 rounded">
                        <div className="d-flex align-items-start">
                          <div 
                            className="event-color-indicator me-3"
                            style={{ backgroundColor: event.color, width: '4px', borderRadius: '2px', height: '100%' }}
                          ></div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <Badge bg="light" text="dark" className="fw-normal">
                                {event.time}
                              </Badge>
                              <i className="fas fa-bell text-muted"></i>
                            </div>
                            <h6 className="fw-bold text-dark mb-1">{event.name}</h6>
                            <p className="text-muted small mb-0">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-calendar-times fa-2x text-muted mb-3"></i>
                    <p className="text-muted mb-0">No events scheduled for this day</p>
                  </div>
                )}

                <div className="text-center mt-4">
                  <Button variant="primary">
                    <i className="fas fa-plus me-2"></i>
                    Add New Event
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .calendar-week-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          text-align: center;
        }
        
        .week-day-header {
          font-weight: 600;
          color: #636E72;
          font-size: 14px;
          padding: 8px;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        
        .calendar-day {
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          background: white;
          border: 2px solid transparent;
        }
        
        .calendar-day:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
        }
        
        .calendar-day.today {
          background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
          color: white;
        }
        
        .calendar-day.selected {
          border-color: #3498db;
        }
        
        .calendar-day.has-event .day-number::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3498db;
        }
        
        .calendar-day.today.has-event .day-number::after {
          background: white;
        }
        
        .day-number {
          font-weight: 600;
          font-size: 14px;
        }
        
        .calendar-day.empty {
          background: transparent;
          cursor: default;
        }
        
        .calendar-day.empty:hover {
          background: transparent;
          transform: none;
        }
        
        .event-item {
          background: #f8f9fa;
          border-left: 4px solid #3498db;
          transition: all 0.2s ease;
        }
        
        .event-item:hover {
          background: #e9ecef;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default Calendar;