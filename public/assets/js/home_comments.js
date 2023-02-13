// {
//     let createComment= function(){
//         let newCommentForm= $('new-comment-form');
//         newCommentForm.submit(function(e){
//             e.preventDefault();

//             $.ajax({
//                 type:'post',
//                 url:'/comment/create',
//                 data: newCommentForm.serialize(),
//                 success: function(data){
//                     let newComment= newCommentDOM(data.data.comment);
//                     $(`#posts-comments-${post._id}`).prepend(newComment);


//                 },error: function(error){
//                     console.log(error.responseText);
//                 }
//             })

//         })

        

//     }
//     let newCommentDOM= function(comment){
//         return $(`<li id="comment-${comment._id}">

//         <p>     
//             <small>
//                     <a href="/comment/destroy/${comment.id}">X</a>
    
//             </small>
//             ${comment.content}
//             <br>
//             <small>
//                     ${comment.user.name}
//             </small>
//     </p>
    
//     </li>`)
//     }
//     createComment();
// }
