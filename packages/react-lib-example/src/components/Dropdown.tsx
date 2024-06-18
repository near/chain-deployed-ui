import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const options = [
  { label: "Near", id: 1 },
  { label: "BTC", id: 2 },
  { label: "ETH", id: 3 },
];

export function Dropdown() {
  return (
    <Autocomplete
      disablePortal
      options={options}
      renderInput={(params) => <TextField {...params} label="Chains" />}
    />
  );
}
