const Post= require('../models/post');
const User= require('../models/user');
const Friendship = require('../models/friendship');
module.exports.home= async function(req,res){
    try{
        let posts=await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user',
        },
        populate:{
            path:'likes'
        }
    }).populate('likes');
    
    let users= await User.find({});
    let signedUser= await User.find({email: req.user?.email});
    let friends= signedUser[0]?.friendships;
    console.log(friends);
    
    
    
    
    
    
    return res.render("home",{
        title:"Codeial | Home",
        posts: posts,
        all_users: users,
        friends: friends
    })

    }catch(err){
        console.log('Error',err);
        return;

    }
    
    
        
        
    
};