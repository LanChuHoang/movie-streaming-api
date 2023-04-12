export default () => ({
  port: parseInt(process.env.PORT || "") || 8000,
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://gr1-client.netlify.app",
      "https://gr1-api.netlify.app",
    ],
    credentials: true,
  },
});
