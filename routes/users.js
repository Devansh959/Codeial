const express= require("express");
const router= express.Router();
const passport= require('passport');
const userContoller= require("../controllers/users_controller");

router.get('/profile/:id', passport.checkAuthentication, userContoller.profile );
router.post('/update/:id',passport.checkAuthentication, userContoller.update);
router.get('/sign-up', userContoller.signUp);
router.get('/sign-in', userContoller.signIn);
router.post('/create', userContoller.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: "/users/sign-in"},
), userContoller.createSession)
router.get('/sign-out',userContoller.destroySession);
router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userContoller.createSession);
router.get('/reset', userContoller.enterMail);
router.post('/forget-password', userContoller.forgetPassword);
router.get('/reset-password',userContoller.resetpassword);
router.post('/resetsuccess',userContoller.resetsuccess);
router.post('/add-friend', userContoller.addFriend)

module.exports= router;