const User= require("../models/user")
const fs=require('fs');
const path= require('path');
const nodemailer= require('../config/nodemailer');
const jwt= require('jsonwebtoken');
const Friendship= require('../models/friendship');

const sendResetPasswordMail= async function(name,email,token){
     

          nodemailer.transporter.sendMail({
               from: 'vermashubham5000@gmail.com',
               to: email,
               subject: 'Reset Your Password',
               html: '<p>Hi '+name+', Please copy the link and <a href="http://localhost:2000/users/reset-password?token='+token+'">reset your password </a></p>'
           },(err,info)=>{
               if(err){
                   console.log('error in sending mail',err);
                   return;
               }
               console.log('Message sent', info);
               return;
       
           })
       
     
     }
module.exports.profile = function(req,res){
     User.findById(req.params.id,function(err,user){
          return res.render("userprofile",{
               title:"User Profile",
               profile_user:user,
          })  
     })
     
}
module.exports.update= async function(req,res){
     // if (req.user.id == req.params.id){
     //      User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
     //           return res.redirect('back');
     //      })
     // }else{
     //      return res.status(401).send('Unauthorized');
     // }
     if (req.user.id == req.params.id){
          try{
               let user= await User.findById(req.params.id);
               ;
               User.uploadedAvatar(req,res,function(err){
                    if(err){
                         console.log('*****Multer Error:',err)
                    }
                    user.name= req.body.name;
                    user.email= req.body.email;
                    if(req.file){
                         if(user.avatar){
                              fs.unlinkSync(path.join(__dirname,'..', user.avatar));
                              
                         }
                         user.avatar= User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');

               });


          }catch(err){
               req.flash('error',err)
               return res.redirect('back');

          }

     }else{
          req.flash('error','Unauthorized');
          return res.status(401).send('Unauthorized');

     }

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
     req.flash('success','Logged in Successfully');
     return res.redirect('/');
}
module.exports.destroySession = function(req,res){
     req.logout(function(err) {
          if (err) { return next(err); }
          req.flash('success','You have Logged out Successfully');
          res.redirect('/');
        });
     
}
module.exports.forgetPassword= async function(req,res){
     try{
          console.log(req.body.email);
          const userdata=await User.findOne({email:req.body.email});
          if(userdata){
               let user=await User.updateOne({email:req.body.email},{$set:{token: jwt.sign(userdata.toJSON(),'codeial',{expiresIn:'10000'})}});
               const userinfo=await User.findOne({email:req.body.email});
               sendResetPasswordMail(userinfo.name, userinfo.email,userinfo.token);
               req.flash('success','Please check Your Email');
               res.redirect('/');
               


          }else{
               res.status(200).send({success:true,msg:'This email does not exist'})
          }

     }catch(err){
          console.log(err);
          res.status(400).send({success:false,msg:err});
     }

}
module.exports.enterMail= function(req,res){
     return res.render("user_resetPassword",{
          title: 'Reset Password'
     });

}
module.exports.resetpassword= async(req,res)=>{
     try{
          
          const token= req.query.token;
          console.log(token);
          const tokendata= await User.findOne({token: token});
          console.log(tokendata);
          if(tokendata){
               console.log('inside');
               
               return res.render('reset_password',{
                    title: 'Reset Password',
                    user: tokendata

               })
          }else{
               return res.json(500,{
                    message:'User Not found'
                })
          }
     }catch(err){
          return res.json(500,{
               message:'Internal Server Error'
           })
     }
}
module.exports.resetsuccess = async function(req,res){
     if(req.body.password==req.body.confirmpassword){
     const userdata = await User.findByIdAndUpdate({_id:req.body.userID},{$set:{password:req.body.password,token:''}},{new:true});
     req.flash('success','Password Changed Successfully');
     res.redirect('/');
     }else{
          req.flash('error','Passwords doesnt Match');
          res.redirect('back');
     }
}
module.exports.addFriend= async function(req,res){
     console.log("hi");
     await Friendship.create({
               from_user: req.body.from_user,
               to_user: req.body.to_user
          })
     const user1= await User.findById({_id:req.body.from_user});
     console.log(user1);
     const user2= await User.findById({_id:req.body.to_user});
     user1.friendships.push({name: user2.name,
     id:user2.id});
     user1.save();
     user2.friendships.push({
          name: user1.name,
          id:user1.id
     });
     console.log(user1);
     user2.save();


     req.flash('success','Added as a Friend');
     res.redirect('/');
}