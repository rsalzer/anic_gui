import { Slider } from "./components/Slider/Slider.jsx";

export function SliderSetting({
  name,
  value,
  min,
  max,
  divider,
  onValueChanged,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "5px",
          whiteSpace: "nowrap",
          justifyContent: "space-between",
          verticalAlign: "middle",
        }}
      >
        <b>
          {name}: {value.toFixed(2)}
        </b>
        <div style={{ display: "flex", maxWidth: "500px", gap: "10px" }}>
          {min.toFixed(2)}
          <Slider
            onValueChanged={(internalValue) =>
              onValueChanged(internalValue / divider)
            }
            value={value * divider}
            min={min * divider}
            max={max * divider}
          />
          {max.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
