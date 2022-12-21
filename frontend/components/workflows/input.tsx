import React, { useState, useEffect } from "react";
import { InputProps, RangeProps, OptionsProps } from "../../lib/types";

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
          className={option === value ? "active" : ""}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default function Input(props: InputProps) {
  const { params } = props;
  return (
    <div className="mt-6">
      <label className="block font-medium text-gray-500">{props.label}</label>
      <div className="mt-2 shadow-sm ">
        {props.type === "range" && (
          <Range
            // todo: unsure how to handle type error on params.min
            id={props.id}
            min={(params as RangeProps).min}
            max={(params as RangeProps).max}
            step={(params as RangeProps).step}
            value={props.value}
            onChange={props.setValue}
          />
        )}
        {props.type === "options" && (
          <Options
            options={(params as OptionsProps).options}
            value={props.value}
            onChange={props.setValue}
          />
        )}
      </div>
    </div>
  );
}
