import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export const FontSlider = () => {
  const [value, setValue] = useState(70);

  return (
    <Box>
      <Typography sx={{ mt: 6, mb: 3, fontSize: 10 + (10 * value) / 100 }}>
        Use the slider below to change the font size
      </Typography>
      <Slider
        size="small"
        value={value}
        aria-label="Font Slider"
        valueLabelDisplay="auto"
        onChange={(e) => {
          const element = e.target as HTMLInputElement;
          setValue(Number(element.value));
        }}
      />
    </Box>
  );
};
