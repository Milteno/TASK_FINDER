import React, { useState } from "react";
import classes from "./addNote.module.scss";

const AddNote: React.FC<{
  onCancel: () => void;
  onSave: (note: any) => void;
  note?: any;
}> = ({ onCancel, onSave, note }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [date, setDate] = useState(note?.date || "");
  const [time, setTime] = useState(note?.time || "");
  const [location, setLocation] = useState(note?.location || "");
  const [phoneNumber, setPhoneNumber] = useState(note?.phoneNumber || "");
  const [tasks, setTasks] = useState(note?.tasks || "");
  const [duration, setDuration] = useState(note?.duration || "");
  const [additionalInfo, setAdditionalInfo] = useState(
    note?.additionalInfo || ""
  );
  const [hourlyRate, setHourlyRate] = useState(note?.hourlyRate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      date,
      time,
      location,
      phoneNumber,
      tasks,
      duration,
      additionalInfo,
      hourlyRate,
    });
  };

  return (
    <div className={classes.addNoteWrapper}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Tasks</label>
          <textarea
            maxLength={400}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
          />
        </div>
        <div>
          <label>Duration</label>
          <textarea
            maxLength={400}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Additional Info</label>
          <textarea
            maxLength={400}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
        <div>
          <label>Hourly Rate</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
        <button type="submit">Save Note</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddNote;
