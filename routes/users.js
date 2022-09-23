const express= require("express");
const router= express.Router();
const userContoller= require("../controllers/users_controller");

router.get('/profile', userContoller.profile );
router.get('/sign-up', userContoller.signUp);
router.get('/sign-in', userContoller.signIn);
router.post('/create', userContoller.create);

module.exports= router;