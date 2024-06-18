import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Chain Deployed UI
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}
