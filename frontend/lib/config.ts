export const WORKFLOWS = {
  "dalle-image-gen": {
    name: "DALLE-2",
    available: true,
    author: "Algovera",
    short_desc: "Generate images and optionally mint them as NFTs",
    long_desc: `Generate images using transformers to create images of your choice.
          You can choose from a variety of models and styles to generate images from.
          Once you have generated an image, you can mint it as an NFT on the blockchain.
          `,
    blocks: [
      {
        name: "DALLE-2",
        desc: "Generate an image",
        light_icon: "openai-white.png",
        dark_icon: "openai-black.png",
      },
      {
        name: "Mint NFT",
        desc: "Mint the image on Ethereum.",
        light_icon:
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
        dark_icon:
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
      },
    ],
  },
  "sd-image-gen": {
    name: "Stable Diffusion",
    available: true,
    author: "Algovera",
    short_desc: "Generate images and optionally mint them as NFTs",
    long_desc: `Generate images using transformers to create images of your choice.
          You can choose from a variety of models and styles to generate images from.
          Once you have generated an image, you can mint it as an NFT on the blockchain.
          `,
    blocks: [
      {
        name: "DALLE-2",
        desc: "Generate an image",
        light_icon: "openai-white.png",
        dark_icon: "openai-black.png",
      },
      {
        name: "Mint NFT",
        desc: "Mint the image on Ethereum.",
        light_icon:
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
        dark_icon:
          "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
      },
    ],
  },
  "text-summarisation": {
    name: "Text Summarization",
    available: false,
    author: "Algovera",
    short_desc: "Summarize text with GPT-3",
    long_desc: `Summarize text using OpenAI's GPT-3 model.`,
    blocks: [
      {
        name: "GPT-3",
        desc: "Summarize text",
        light_icon: "openai-white.png",
        dark_icon: "openai-black.png",
      },
    ],
  },
  chatgpt: {
    name: "Chat-GPT Interface",
    available: false,
    author: "Algovera",
    short_desc: "Interact with Chat-GPT",
    long_desc: `Interact with Chat-GPT using Algovera's interface.`,
    blocks: [
      {
        name: "GPT-3",
        desc: "Summarize text",
        light_icon: "openai-white.png",
        dark_icon: "openai-black.png",
      },
    ],
  },
};

export const iconUrlPrefix =
  "https://firebasestorage.googleapis.com/v0/b/sdxcrypto-algovera.appspot.com/o/frontend%2Fassets%2Ficons%2F";
export const iconUrlSuffix = "?alt=media";

const OLD = [
  // {
  //   id: "1",
  //   name: "Image Generation",
  //   href: "/workflows/view?id=dalle-image-gen",
  //   available: true,
  //   author: "Algovera",
  //   description: "Generate images from text prompts",
  //   image: imageGenerationImage,
  //   blockIcons: [],
  // },
  // {
  //   id: "2",
  //   name: "Text Summarization",
  //   href: "/workflows/text-summarization",
  //   available: false,
  //   author: "Algovera",
  //   description: "Summarize text",
  //   image: textSummarizationImage,
  // },
  // {
  //   id: "3",
  //   name: "Image Captioning",
  //   href: "/workflows/image-captioning",
  //   available: false,
  //   author: "Algovera",
  //   description: "Generate captions for images",
  //   image: imageCaptioningImage,
  // },
  // {
  //   id: "4",
  //   name: "Image to Image",
  //   href: "/workflows/image-to-image",
  //   available: false,
  //   author: "Algovera",
  //   description: "Generate images from images",
  //   image: imageTranslationImage,
  // },
  // {
  //   id: "5",
  //   name: "Animation Generation",
  //   href: "/workflows/animation-generation",
  //   available: false,
  //   author: "Algovera",
  //   description: "Generate animations from text prompts",
  //   image: gifImage,
  // },
  // {
  //   id: "6",
  //   name: "Discord Integration",
  //   href: "/workflows/animation-generation",
  //   available: false,
  //   author: "Algovera",
  //   description: "Image generation via a Discord bot",
  //   image: discordBotImage,
  // },
  // {
  //   id: "7",
  //   name: "Notion Integration",
  //   href: "/workflows/animation-generation",
  //   available: false,
  //   author: "Algovera",
  //   description: "Store text summarisation of Discord chat on Notion",
  //   image: notionImage,
  // },
  // {
  //   id: "8",
  //   name: "Discourse Integration",
  //   href: "/workflows/animation-generation",
  //   available: false,
  //   author: "Algovera",
  //   description: "Generate image from a discourse post",
  //   image: discourseBotImage,
  // },
];
