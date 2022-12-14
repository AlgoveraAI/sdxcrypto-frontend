import { StaticImageData } from "next/image";

export type PageProps = {};

// types to define the models and their inputs

// used to define the inputs for a model)
type Input = {
  id: string;
  label: string;
  type: string;
  defaultValue: number;
  info?: string;
  params: object;
};

export type Model = {
  name: string;
  id: string;
  description: string;
  website: string;
  image: StaticImageData; // todo make this a URL
  credits_per_use: number;
  inputs: Input[];
};

export type Models = {
  [key: string]: Model;
};

// types for input components

// props for the Input component
// (modified version of InputSetup)
export type InputProps = {
  id: string;
  label: string;
  type: string;
  value: number;
  setValue: (value: number) => void;
  info?: string;
  params: object;
};

export type RangeProps = {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

export type OptionsProps = {
  options: number[];
  value: number;
  onChange: (value: number) => void;
};

export type WorkflowConfigType = { [field: string]: any };
export type WorkflowConfigsType = {
  [key: string]: WorkflowConfigType;
};
export type BlockConfigType = {
  [field: string]: any;
};
export type BlockConfigsType = {
  [key: string]: BlockConfigType;
};
