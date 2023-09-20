import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({
  loaderColor = "#ffffff",
  loaderSize = "36px",
  label = "",
}) => {
  return (
    <div className="loader">
      <ClipLoader color={loaderColor} size={loaderSize} />
      {label && <span className="loader__label">{label}</span>}
    </div>
  );
};

export default Loader;
