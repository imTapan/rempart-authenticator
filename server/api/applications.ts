const allApps = [
  {
    name: "Rempart Content",
    code: "rempcontent",
    site: "https://rempart-content.netlify.app",
  },
  { name: "Rempart Prompts", code: "rempprompt" },
  { name: "Rempart", code: "rempart" },
  { name: "Rempart Package", code: "remppackage" },
];

export default defineEventHandler((event) => {
  return allApps;
});
