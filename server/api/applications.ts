const allApps = [
  {
    label: "Rempart Content",
    value: "rempcontent",
    site: "https://rempart-content.netlify.app",
  },
  { label: "Rempart Prompts", value: "rempprompt" },
  { label: "Rempart", value: "rempart" },
  { label: "Rempart Package", value: "remppackage" },
];

export default defineEventHandler((event) => {
  return allApps;
});
