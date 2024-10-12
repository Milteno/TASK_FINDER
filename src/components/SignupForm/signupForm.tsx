import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./signupForm.module.scss";

interface SignupFormProps {
  taskId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  taskId,
  onCancel,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [citizenship, setCitizenship] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pesel, setPesel] = useState("");
  const [sanitaryStatus, setSanitaryStatus] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [nfzBranch, setNfzBranch] = useState("");
  const [studentStatus, setStudentStatus] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState(false);
  const [pensionStatus, setPensionStatus] = useState(false);
  const [rentStatus, setRentStatus] = useState(false);
  const [businessStatus, setBusinessStatus] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const handleSubmit = async () => {
    const signupData = {
      taskId,
      citizenship,
      firstName,
      lastName,
      email,
      phoneNumber,
      pesel,
      sanitaryStatus,
      address: {
        street,
        houseNumber,
        apartmentNumber,
        postalCode,
        city,
        district,
      },
      nfzBranch,
      studentStatus,
      employmentStatus,
      pensionStatus,
      rentStatus,
      businessStatus,
    };

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(signupData),
    });

    if (response.ok) {
      alert("Signup successful");
      onSuccess();
      onCancel();
    } else {
      const errorMessage = await response.text();
      alert(`Signup failed: ${errorMessage}`);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <label>
              Narodowość:
              <input
                type="text"
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
              />
            </label>
          </div>
        );
      case 2:
        return (
          <div>
            <label>
              Imię:
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label>
              Nazwisko:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Numer telefonu:
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            <label>
              Numer PESEL:
              <input
                type="text"
                value={pesel}
                onChange={(e) => setPesel(e.target.value)}
              />
            </label>
            <label>
              Stan książeczki epidemiologicznej:
              <input
                type="text"
                value={sanitaryStatus}
                onChange={(e) => setSanitaryStatus(e.target.value)}
              />
            </label>
          </div>
        );
      case 3:
        return (
          <div>
            <label>
              Ulica:
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </label>
            <label>
              Numer domu:
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </label>
            <label>
              Numer mieszkania:
              <input
                type="text"
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
              />
            </label>
            <label>
              Kod pocztowy:
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </label>
            <label>
              Miasto zamieszkania:
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            <label>
              Powiat:
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </label>
          </div>
        );
      case 4:
        return (
          <div>
            <label>
              Oddział Narodowego Funduszu Zdrowia:
              <input
                type="text"
                value={nfzBranch}
                onChange={(e) => setNfzBranch(e.target.value)}
              />
            </label>
            <label>
              Czy masz status studenta i jesteś poniżej 26 roku życia?
              <input
                type="checkbox"
                checked={studentStatus}
                onChange={(e) => setStudentStatus(e.target.checked)}
              />
            </label>
            <label>
              Czy jesteś gdzieś zatrudniony?
              <input
                type="checkbox"
                checked={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.checked)}
              />
            </label>
            <label>
              Czy pobierasz emeryturę?
              <input
                type="checkbox"
                checked={pensionStatus}
                onChange={(e) => setPensionStatus(e.target.checked)}
              />
            </label>
            <label>
              Czy pobierasz rentę?
              <input
                type="checkbox"
                checked={rentStatus}
                onChange={(e) => setRentStatus(e.target.checked)}
              />
            </label>
            <label>
              Czy posiadasz firmę?
              <input
                type="checkbox"
                checked={businessStatus}
                onChange={(e) => setBusinessStatus(e.target.checked)}
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={classes.signupFormWrapper}>
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        <div className={classes.buttonGroup}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}>Cofnij</button>
          )}
          {step < 4 && <button onClick={() => setStep(step + 1)}>Dalej</button>}
          {step === 4 && (
            <button onClick={handleSubmit}>Wyślij zgłoszenie</button>
          )}
        </div>
        <button onClick={onCancel}>Anuluj</button>
      </form>
    </div>
  );
};

export default SignupForm;
