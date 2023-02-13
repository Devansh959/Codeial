module.exports.index= function(req,res){
    return res.json(200,{
        message: "New version",
        posts:[]
    })
}