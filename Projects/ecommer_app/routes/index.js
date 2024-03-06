const useExpressRoute = (app) => {
  app.get("/", (req, res, next) => {
    res.render("index", { data: "123" });
  });
  app.use("/users", userRoute);
};

export default useExpressRoute;
