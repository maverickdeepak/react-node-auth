import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../db";

export const loginRoute = {
  path: "/api/login",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "user not found! please check you email address.",
      });
    }

    const { _id: id, isVerified, passwordHash, info } = user;

    const isCorrect = await bcrypt.compare(password, passwordHash);

    if (isCorrect) {
      jwt.sign(
        {
          id,
          isVerified,
          info,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        (error, token) => {
            if (error) {
                return res.status(500).json({
                    message: 'something went wrong'
                })
            }
            res.status(200).json({
                token: token
            })
        }
      );
    } else {
        res.status(401).json({
            message: 'user email or password is incorrect!'
        })
    }
  },
};
