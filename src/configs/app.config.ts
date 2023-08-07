export default () => ({
  port: parseInt(process.env.PORT || "") || 8000,
  cors: {
    origin: "*",
    credentials: true,
  },
});
