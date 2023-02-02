export function DropdownSetting({
  name,
  selectedValue,
  values,
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
        <b>{name}:</b>
        <div style={{ display: "flex", maxWidth: "500px", gap: "10px" }}>
          <select
            name="models"
            id="models"
            onChange={(e) => onValueChanged(e.target.value)}
          >
            {values.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
