import Box from '@mui/material/Box';
import Button from "@mui/material/Button";

export const ButtonRow = () => {
  return (
    <Box gap={1} display="flex">
      <Button variant="contained">Default</Button>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" disabled>
        Disabled
      </Button>
      <Button variant="contained" color="primary" href="http://near.org" target='_blank'>
        Link
      </Button>
    </Box>
  );
};
