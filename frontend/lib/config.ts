export const WORKFLOWS = {
  "dalle-image-gen": {
    name: "Image Generation",
    available: true,
    author: "Algovera",
    short_desc: "Generate images using DALLE-2",
    long_desc: `Generate images using transformers to create images of your choice.
          You can choose from a variety of models and styles to generate images from.
          Once you have generated an image, you can mint it as an NFT on the blockchain.
          `,
    blocks: [
      {
        name: "DALLE-2",
        desc: "Generate an image",
        icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
      },
      {
        name: "Mint NFT",
        desc: "Mint the image on Ethereum.",
        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
      },
    ],
  },
};
