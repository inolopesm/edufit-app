import edufit from "@edufit/ui";

export default {
  content: ["./index.html", "./src/**/*.js"],
  theme: { extend: {} },
  plugins: [edufit()],
};
