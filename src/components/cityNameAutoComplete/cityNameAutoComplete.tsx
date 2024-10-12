import React, { useState, useEffect, useRef } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const CityNameAutoComplete: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  label,
  disabled = false,
}) => {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
      componentRestrictions: { country: ["pl", "de"] },
    },
    debounce: 300,
  });

  const [isInputActive, setIsInputActive] = useState(false);
  const ref = useOnclickOutside(() => {
    setIsInputActive(false);
    clearSuggestions();
  });

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      setValue(description, false);
      clearSuggestions();
      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log("📍 Coordinates: ", { lat, lng });
        })
        .catch((error) => {
          console.log(" Error: ", error);
        });

      onChange(description);
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <label>{label}</label>
      <input
        value={inputValue}
        onChange={handleInput}
        disabled={!ready || disabled}
        onFocus={() => setIsInputActive(true)}
      />
      {isInputActive && status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

export default CityNameAutoComplete;
