import "../styles/FunctionButton.css";

function FunctionButton({ onClick, buttonName }) {
  return (
    <>
      <button onClick={onClick}>{buttonName}</button>
    </>
  );
}

export default FunctionButton;
