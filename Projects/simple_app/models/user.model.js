import connection from "../config/db";

const userModel = {
  getAllUser: async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users";
        connection.query(query, (err, result) => {
          if (err) reject(new Error(err));
          resolve(result);
        });
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  },
  createNewUser: async (data) => {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "INSERT INTO users (name, username, password, email, is_admin, yob, phone, address, bio, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        connection.query(query, [data.name, data.username, data.password, data.email, data.is_admin, data.yob, data.phone, data.bio, data.image_url], (err, result) => {
          if (err) reject(new Error(err));
          resolve(result);
        })
      })
      return result;
    } catch (err) {
      console.log(err);
    }
  }
};

export default userModel;
