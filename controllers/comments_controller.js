const Comment= require("../models/comment");
const Post= require("../models/post")
const commentsMailer= require('../mailers/comments_mailer');
const queue= require('../config/kue');
const commentEmailWorker= require('../workers/comment_email_worker');
const Like= require('../models/like');

module.exports.create= async function(req,res){
    try{
        let post=await Post.findById(req.body.post);
        if(post){
            let comment=await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            
            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user','name email');
            console.log(comment);
            // commentsMailer.newComment(comment);
            let job= await queue.create('emails',comment).save(function(err){
                console.log(comment);
                if(err){
                    console.log('error in sending to the queue',err);
                    
                }
                console.log('job enqueued',job.id);
            })
            req.flash('success','Comment Created')
            // if(req.xhr){
                
            //     return res.status(200).json({
            //         data: {
            //             comment:comment
            //         },
            //         message: 'Comment created'
            //     })
            // }
            
            res.redirect('/');
            


        }

    }catch(err){
        console.log('Error',err);
        return;
    }
    
    }
module.exports.destroy= async function(req,res){
    
        try{
            let comment= await Comment.findById(req.params.id);
        if(comment.user==req.user.id){
            await Like.deleteMany({likeable:comment._id, onModel:'Comment'});
            let postId= comment.post;
            comment.remove();
            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
            req.flash('success','Comment Deleted')
                return res.redirect('back');
            }else{
            return res.redirect('back');
            }
        }catch(err){
            console.log('Error',err);
            return;
        }
    };