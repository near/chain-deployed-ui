import { useMemo, useState } from "react";
import { createTheme, CssBaseline } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from "@emotion/react";

import App from "./App.tsx";
import { ColorModeContext, Mode } from "./contexts/ColorMode.ts";

function ChainRoot() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<Mode>(prefersDarkMode ? "dark":"light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default ChainRoot;
