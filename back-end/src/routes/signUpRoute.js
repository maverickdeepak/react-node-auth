import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../db";

export const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;
    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").findOne({ email });

    if (user) {
      res.status(409).json({
        message: 'user already exist!'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const startingInfo = {
      hairColor: "",
      favoriteFood: "",
      bio: "",
    };

    const result = await db
      .collection("users")
      .insertOne({
        email,
        passwordHash,
        info: startingInfo,
        isVerified: false,
      });

    const { insertedId } = result;

    jwt.sign(
      {
        id: insertedId,
        email: email,
        info: startingInfo,
        isVerified: false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (error, token) => {
        if(error) {
          console.log(error);
            return res.status(500).json({
              error: 'something went wrong! try again'
            })
        }
        res.status(200).json({
            token: token
        })
      }
    );
  },
};
