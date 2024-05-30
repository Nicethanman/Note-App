import React, { useState } from 'react';
import "../styles/Slider.css";

const SliderComponent = ({ onSliderChange }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setSliderValue(newValue);
    // Call the callback function passed from the parent with the new value
    onSliderChange(newValue);
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        className="slide"
      />
      <p className="slide-value">{sliderValue}</p>
    </div>
  );
};

export default SliderComponent;