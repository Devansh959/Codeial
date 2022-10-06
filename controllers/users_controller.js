const User= require("../models/user")
module.exports.profile = function(req,res){
     res.render("userprofile",{
          title:"User Profiles"
     })
}
module.exports.signIn = function(req,res){
     if(req.isAuthenticated()){
          return res.redirect('/users/profile');
     }
     res.render("user_sign_in",{
          title:"Sign In"
     })
}
module.exports.signUp = function(req,res){
     if(req.isAuthenticated()){
          return res.redirect('/users/profile');
     }

     return res.render("user_sign_up",{
          title:"Sign Up"
     })
}
//get the signup data
module.exports.create= function(req,res){
     if(req.body.password != req.body.confirm_password){
          return res.redirect("back");
     }
     User.findOne({email: req.body.email}, function(err,user){
          if(err){console.log("error in finding the user"); return}
          if(!user){
               User.create(req.body, function(err,user){
                    if(err){console.log("Error in Creating the User"); return}
                    return res.redirect("/users/sign-in")
               })
          }else{
               return res.redirect("back");

          }
     })

}
//sign in and create a session for the user
module.exports.createSession= function(req,res){
     return res.redirect('/');
}
module.exports.destroySession = function(req,res){
     req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
}