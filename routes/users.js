const express= require("express");
const router= express.Router();
const passport= require('passport');
const userContoller= require("../controllers/users_controller");

router.get('/profile', passport.checkAuthentication, userContoller.profile );
router.get('/sign-up', userContoller.signUp);
router.get('/sign-in', userContoller.signIn);
router.post('/create', userContoller.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: "/users/sign-in"},
), userContoller.createSession)
router.get('/sign-out',userContoller.destroySession)

module.exports= router;