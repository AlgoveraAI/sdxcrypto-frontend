import stabilityLogo from "../../../assets/workflows/stability.jpeg";
import openaiLogo from "../../../assets/workflows/openai.jpg";
import { StaticImageData } from "next/image";

export type Model = {
  name: string;
  id: string;
  description: string;
  website: string;
  image: StaticImageData;
  credits_per_use: number;
};

export type Models = {
  [key: string]: Model;
};

export const models: Models = {
  dalle: {
    name: "DALL·E 2",
    id: "dalle",
    description:
      "DALL·E 2 is a new AI system that can create realistic images and art from a description in natural language.",
    website: "https://openai.com/dall-e-2/",
    image: openaiLogo,
    credits_per_use: 2,
  },
  stable: {
    name: "Stable Diffusion",
    id: "stable",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input, cultivates autonomous freedom to produce incredible imagery, empowers billions of people to create stunning art within seconds.",
    website: "https://github.com/CompVis/stable-diffusion",
    image: stabilityLogo,
    credits_per_use: 2,
  },
};
