import PropTypes from "prop-types";
import React from "react";

const SelectField = React.forwardRef(function SelectField(props, ref) {
  const inputRef = React.useRef(ref);
  const labelInputRef = React.useRef(ref);
  const {
    type,
    label,
    id,
    error,
    errors,
    options,
    name,
    placeholder,
    setValue,
  } = props;
  const [msg, setMsg] = React.useState(errors);
  const [currentVal, setCurrentVal] = React.useState("");
  const [currentLabel, setCurrentLabel] = React.useState("");
  const [counter, setCounter] = React.useState(0);
  const [toggleOptions, setToggleOptions] = React.useState(false);
  const [currentOption, setCurrentOption] = React.useState(0);

  const handleInputChange = (option, index) => {
    const { name, setValue } = props;
    setCounter(0);
    setValue({ [name]: option.value });
    setCurrentVal(option.value);
    setCurrentLabel(option.label);
    setCurrentOption((state) => (state = index + 1));
    setToggleOptions((state) => (state = false));
  };
  const handleOnBlur = (event) => {
    const { onBlur, name, setValue } = props;
    setCounter(0);
    setValue({ [name]: currentVal });
    setCurrentVal(currentVal);
    setToggleOptions((state) => (state = false));
    onBlur && onBlur(event);
  };
  const handleOnChange = (event) => {
    const { onChange, name, value, setValue } = props;
    onChange && onChange(event);
  };

  const handleOnClick = (event) => {
    event.target.setSelectionRange(
      event.target.value.length,
      event.target.value.length
    );
    event.target.focus();
    setToggleOptions((state) => (state = !state));
  };

  const handleFocus = (event) => {
    event.preventDefault();
    const { onFocus, value } = props;
    event.target.setSelectionRange(
      event.target.value.length,
      event.target.value.length
    );
    event.target.focus();

    onFocus && onFocus(event);
  };
  const handleKeyUp = (event) => {
    let { onKeyDown, value, setValue } = props;
    let { name, value: v } = event.target;
    setCounter(0);
    if (value.length === 0) {
      // setCurrentVal(value);
      setCounter(0);
    } else {
      if (counter === 0) {
        let newVal = "";
        if (
          event.keyCode === 8 ||
          event.keyCode === 37 ||
          event.keyCode === 38 ||
          event.keyCode === 39 ||
          event.keyCode === 40
        ) {
          newVal = "";
        } else {
          newVal = value.slice(value.length - 1);
        }
        setCurrentVal(newVal);
        setValue({
          [name]: newVal,
        });
      }
      setCounter((c) => c + 1);
    }
  };

  const changeLabel = (value) => {
    const opt = options.find(
      (opt) => opt.label?.toLowerCase() === value.toLowerCase()
    );
    if (opt) {
      setCurrentLabel(opt.label);
    }
  };

  let _props = {
    ...props,
    onChange: handleOnChange,
    onFocus: handleFocus,
    onBlur: handleOnBlur,
    onKeyUp: handleKeyUp,
  };
  delete _props.setValue;
  delete _props.errors;
  delete _props.options;

  React.useEffect(() => {
    if (inputRef.current?.value) {
      (() => {
        const index = options.findIndex(
          (option) => option.label === inputRef.current?.value
        );
        setCurrentVal(inputRef.current?.value);
        changeLabel(inputRef.current?.value);
        setCurrentOption((state) => (state = index + 1));
      })();
    } else {
      (() => {
        setCurrentLabel("");
      })();
    }
  }, [inputRef.current?.value, options]);

  React.useEffect(() => {
    if (currentVal) {
      labelInputRef.current.value = currentLabel;
      if (toggleOptions) {
        const opts = document.querySelectorAll(
          ".text__field__wrapper__options__option"
        );
        opts.forEach((element, index) => {
          element.classList.remove("active");
          if (currentOption === index + 1) {
            element.classList.add("active");
          }
        });
      }
    }
  }, [currentVal, toggleOptions, currentLabel, currentOption]);

  React.useEffect(() => {
    (() => {
      setMsg((state) => (state = errors));
    })();
  }, [errors]);

  return (
    <div className="text__field__wrapper">
      <label htmlFor={id} className="text__field__wrapper__label">
        <span className={`text__field__wrapper__label__text`}>{label}</span>
        <input
          {..._props}
          hidden
          type="text"
          ref={inputRef}
          readOnly
          aria-haspopup={true}
          className="text__field__wrapper__label__input select"
        />
        <input
          {..._props}
          type="text"
          readOnly
          value={currentLabel}
          ref={labelInputRef}
          aria-haspopup={true}
          onClick={handleOnClick}
          className="text__field__wrapper__label__input select"
        />
      </label>
      {toggleOptions && (
        <ul className="text__field__wrapper__options">
          {typeof options === "object"
            ? options.map((option, index) => (
                <li
                  onMouseDown={() => handleInputChange(option, index)}
                  key={`${option.label}${index + 1}`}
                  className="text__field__wrapper__options__option"
                >
                  {option.label}
                </li>
              ))
            : options.map((option, index) => (
                <li
                  onMouseDown={() => handleInputChange(option, index)}
                  key={`${option}${index + 1}`}
                >
                  {option}
                </li>
              ))}
        </ul>
      )}
      {errors && typeof msg === "string" ? (
        <p className="text__field__wrapper__error">{msg}</p>
      ) : (
        msg.length > 0 &&
        msg.map((m, index) => (
          <p className="text__field__wrapper__error" key={index}>
            {m}
          </p>
        ))
      )}
    </div>
  );
});

export default SelectField;
//Validate the props
SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text"]).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  required: PropTypes.bool,
  id: PropTypes.string,
  pattern: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  /* Will be applied to container */
  className: PropTypes.string,
  /* Will be applied to underlying input/textarea tag */
  inputClassName: PropTypes.string,
  /* Will be applied to label */
  labelClassName: PropTypes.string,

  /* Value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // defaultValue: PropTypes.string,
  error: PropTypes.bool,
  errors: PropTypes.any,
};

//Set the default props
SelectField.defaultProps = {
  type: "text",
  label: "",
  placeholder: "",
  errors: "",
  readOnly: false,
  // defaultValue: "",
};
