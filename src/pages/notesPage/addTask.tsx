import React, { useState } from "react";
import classes from "./addTask.module.scss";
import CityNameAutoComplete from "../../components/cityNameAutoComplete/cityNameAutoComplete";

const CATEGORIES = [
  "Opieka nad dzieckiem",
  "Składanie mebli",
  "Inwentaryzacja",
  "Korepetycje",
  "Koszenie trawy",
  "Sprzątanie",
  "Prace ogrodowe",
  "Pomoc w przenoszeniu",
  "Malowanie",
  "Naprawy domowe",
  "Opieka nad zwierzęciem",
];

interface AddTaskProps {
  onCancel: () => void;
  onSave: (task: any) => void;
  initialValues?: any;
}

const AddTask: React.FC<AddTaskProps> = ({
  onCancel,
  onSave,
  initialValues,
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [date, setDate] = useState(initialValues?.date || "");
  const [time, setTime] = useState(initialValues?.time || "");
  const [location, setLocation] = useState(initialValues?.location || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialValues?.phoneNumber || ""
  );
  const [tasks, setTasks] = useState(initialValues?.tasks || "");
  const [duration, setDuration] = useState(initialValues?.duration || "");
  const [additionalInfo, setAdditionalInfo] = useState(
    initialValues?.additionalInfo || ""
  );
  const [hourlyRate, setHourlyRate] = useState(initialValues?.hourlyRate || "");
  const [category, setCategory] = useState(initialValues?.category || "");

  const handleSave = () => {
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
      category,
    });
  };

  return (
    <div className={classes.addTaskWrapper}>
      <h2>{initialValues ? "Edytuj ogłoszenie" : "Dodaj Ogłoszenie"}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={classes.inputGroup}>
          <label>Tytuł ogłoszenia</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Data rozpoczęcia zlecenia</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Godzina rozpoczęcia zlecenia</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Lokalizacja</label>
          <CityNameAutoComplete
            value={location}
            onChange={setLocation}
            label="City"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Numer telefonu</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Zakres obowiązków</label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            maxLength={400}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Czas wykonywania zlecenia</label>
          <textarea
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            maxLength={400}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Informacje dodatkowe</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            maxLength={400}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Stawka godzinowa</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Kategoria</label>
          <input
            type="text"
            list="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="categories">
            {CATEGORIES.map((category, index) => (
              <option key={index} value={category} />
            ))}
          </datalist>
        </div>
        <button type="button" onClick={handleSave}>
          {initialValues ? "Aktualizuj ogłoszenie" : "Dodaj ogłoszenie"}
        </button>
        <button type="button" onClick={onCancel}>
          Anuluj
        </button>
      </form>
    </div>
  );
};

export default AddTask;
