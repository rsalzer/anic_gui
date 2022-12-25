import "./Slider.scss";

export const Slider = ({ min = 0, max = 100, value = 0, onValueChanged }) => {
  return (
    <span
      className="slider"
      style={{ "--progress": ((value - min) / (max - min)) * 100 + "%" }}
    >
      <span className="slider__progress-bar" />
      <input
        className="slider__input"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const newValue = parseInt(event.target.value);
          onValueChanged(newValue);
        }}
      />
    </span>
  );
};

// Slider.propTypes = {
//   min: PropTypes.number,
//   max: PropTypes.number,
//   value: PropTypes.number,
//   onValueChanged: PropTypes.func.isRequired,
// }
