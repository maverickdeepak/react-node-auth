import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getDbConnection } from "../db";

export const updateUserInfoRoute = {
  path: "/api/user/:userId",
  method: "put",
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const updatedInfo = (({ favoriteFood, hairColor, bio }) =>
      ({
        favoriteFood,
        hairColor,
        bio,
      }))(req.body);

    if (!authorization) {
      return res.status(401).json({
        message: "something went wrong!",
      });
    }

    const token = authorization?.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error)
        res.status(401).json({
          message: "unable to verify user",
        });
      const { id } = decoded;

      if (id !== userId) {
        return res.status(403).json({
          message: "not allowed to update user data",
        });
      }

      const db = getDbConnection("react-auth-db");
      const result = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectID(id) },
          { $set: { info: updatedInfo } },
          { returnOriginal: false }
        );
      const { email, isVerified, info } = result.value;
      jwt.sign(
        { id, email, isVerified, info },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        (error, token) => {
          if (error)
            return res.status(400).json({
              message: "something went wrong! try again later",
            });
          res.status(200).json({token});
        }
      );
    });
  },
};
