import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useContext } from "react";

import { ColorModeContext } from "../contexts/ColorMode";

export const ModeControl = () => {
  const colorModeContext = useContext(ColorModeContext);

  return (
    <Box>
      {colorModeContext.mode.replace(/\w/, (c) => c.toUpperCase())} mode
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => {
          const newMode = colorModeContext.mode === "dark" ? "light" : "dark";
          colorModeContext.setMode(newMode);
        }}
        color="inherit"
      >
        {colorModeContext.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
};
