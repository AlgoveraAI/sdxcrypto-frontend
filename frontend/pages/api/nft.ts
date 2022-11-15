export default function handler(req, res) {
  console.log("got nft request");
  res.status(200).json({ name: "John Doe" });
}
