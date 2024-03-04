import userModel from "../models/user.model";

const index = (req, res, next) => {
  const result = userModel.getAllUser();
  result
    .then((data) => res.render("users/index", { userData: data }))
    .catch((err) => console.log(err));
};

const edit = (req, res, next) => {
  res.render("users/edituser");
};

const create = (req, res, next) => {
  const data = req.body;
  console.log(data);
  res.redirect("/users/edit");
};
const userController = {
  index,
  edit,
  create,
};
export default userController;
