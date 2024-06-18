import "./App.css";
import {
  ButtonRow,
  Message,
  Copyright,
  Dropdown,
  ModeControl,
  FontSlider,
} from "./components";

function App() {
  return (
    <>
      <div>
        <ModeControl />
        <br />
        <ButtonRow />
        <br />
        <Dropdown />
        <br />
        <Message />
        <br />
        <FontSlider />
        <br />
      </div>
      <Copyright />
    </>
  );
}

export default App;
