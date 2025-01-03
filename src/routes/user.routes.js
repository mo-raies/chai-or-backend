import {Router} from "express"
import { registerUser ,loginUser,logoutUser} from "../controllers/user.controllers.js";
import { upload} from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware"


const router = Router ()

router.route("/register").post(
 upload.fields([
  {
    name: "avatar",
    maxCount: 1
  },
  {
    name: "coverImage",
    maxCount: 1
  }
 ]),
  registerUser
);

router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT,logoutUser)

export default router 




