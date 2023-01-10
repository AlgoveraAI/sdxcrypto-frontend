import React, { useEffect } from "react";
import { InputProps, RangeProps, OptionsProps } from "../../lib/types";
import Popup from "reactjs-popup";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const Range: React.FC<RangeProps> = ({
  min,
  max,
  step,
  value,
  id,
  onChange,
}) => {
  const changeSliderColor = (e: HTMLInputElement) => {
    if (e.value) {
      const value = parseInt(e.value);
      const min = parseInt(e.min);
      const max = parseInt(e.max);
      const percent = ((value - min) / (max - min)) * 100;
      const bg = `linear-gradient(90deg, #1937D6 ${percent}%, #0A101D ${percent}%)`;
      e.style.background = bg;
    }
  };
  useEffect(() => {
    // set the initial colors on load
    changeSliderColor(document.getElementById(id) as HTMLInputElement);
  }, []);
  return (
    <div>
      <div className="text-white font-bold text-left">{value}</div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
          changeSliderColor(e.target);
        }}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-primary-lighter"
      />
    </div>
  );
};

const Options: React.FC<OptionsProps> = ({ options, value, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`${
            value === option
              ? "bg-primary-lighter text-white"
              : "bg-background-darker text-gray-500"
          } w-[80px] px-4 py-2 mr-2 text-sm font-medium rounded-md hover:bg-primary-lighter hover:text-white`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default function Input(props: InputProps) {
  const { params, value, setValue, info, type, id, label } = props;
  console.log("PARAM", params, value);
  return (
    <div className="mt-6">
      <label className="block font-medium text-gray-500">
        {label}
        {info ? (
          <Popup
            trigger={
              <InformationCircleIcon className="inline-block w-4 h-4 ml-1 text-gray-400" />
            }
            position="right center"
            on="hover"
            {...{ contentStyle: { background: "black" } }}
          >
            <div className="text-sm text-gray-300">{info}</div>
          </Popup>
        ) : null}
      </label>

      <div className="mt-2 shadow-sm ">
        {type === "range" && (
          <Range
            // todo: unsure if this is best way
            // to handle type error on params.min
            id={id}
            min={(params as RangeProps).min}
            max={(params as RangeProps).max}
            step={(params as RangeProps).step}
            value={value}
            onChange={setValue}
          />
        )}
        {type === "options" && (
          <Options
            options={(params as OptionsProps).options}
            value={value}
            onChange={setValue}
          />
        )}
      </div>
    </div>
  );
}
