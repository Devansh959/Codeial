module.exports.home= function(req,res){
    console.log(req.cookies);
    res.cookie("something", "blahblah")
    return res.render("home",{
        title:"Home"
    })
}