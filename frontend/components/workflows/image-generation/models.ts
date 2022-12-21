import stabilityLogo from "../../../assets/workflows/stability.jpeg";
import openaiLogo from "../../../assets/workflows/openai.jpg";
import { Models } from "../../../lib/types";

export const models: Models = {
  dalle: {
    name: "DALL·E 2",
    id: "dalle",
    description:
      "DALL·E 2 is a new AI system that can create realistic images and art from a description in natural language.",
    website: "https://openai.com/dall-e-2/",
    image: openaiLogo,
    credits_per_use: 2,
    inputs: [
      {
        id: "width",
        label: "Width",
        // type: "options",
        // options: [256, 512, 1024],
        // default: 512,
        type: "range",
        defaultValue: 512,
        params: {
          min: 128,
          max: 1024,
          step: 8,
        },
      },
      {
        id: "height",
        label: "Height",
        // type: "options",
        // options: [256, 512, 1024],
        // default: 512,
        type: "range",
        defaultValue: 512,
        params: {
          min: 128,
          max: 1024,
          step: 8,
        },
      },
    ],
  },
  stable: {
    name: "Stable Diffusion",
    id: "stable",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input, cultivates autonomous freedom to produce incredible imagery, empowers billions of people to create stunning art within seconds.",
    website: "https://github.com/CompVis/stable-diffusion",
    image: stabilityLogo,
    credits_per_use: 2,
    inputs: [
      {
        id: "width",
        label: "Width",
        type: "range",
        params: {
          min: 128,
          max: 1024,
          step: 8,
        },
        defaultValue: 512,
      },
      {
        id: "height",
        label: "Height",
        type: "range",
        params: {
          min: 128,
          max: 1024,
          step: 8,
        },
        defaultValue: 512,
      },
      {
        id: "inferenceSteps",
        label: "Inference Steps",
        type: "range",
        params: {
          min: 0,
          max: 50,
          step: 1,
        },
        defaultValue: 25,
        info: "How many steps to spend generating your image",
      },
      {
        id: "guidanceScale",
        label: "Guidance Scale",
        type: "range",
        params: {
          min: 0,
          max: 50,
          step: 0.5,
        },
        defaultValue: 7.5,
        info: "How much the image will be like your prompt",
      },
    ],
  },
};
