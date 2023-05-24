const koa = require("koa")
const KoaRouter = require("koa-router")
const parser = require("koa-bodyparser")
const user = require("../../model/User")
const {_explicitStatus} = require("koa/lib/response");

function createUser(body) {

}

function init(router) {
    router.post("/:userId/user", (context, next) => {
       user.find({id: context.params.userId}, function(err, _user){
           if (err){
               context.body = "User Not Found"
               return context.status = 404
           }else{
               if (context.request.body.username === undefined &&
                   context.request.body.password === undefined &&
                   context.request.body.roles === undefined
               ) {
                   context.body = "define username, password and roles"
                   return context.status = 401
               } else {
                   let _role = context.body.role
                   if (_user.roles.contains("SuperAdmin")){
                       if (_role === "SuperAdmin"){
                           context.body = "Not Allowed"
                           return context.status = 403
                       }else{
                           if (_role === "Admin" || _role === "User") {
                               user.create({
                                   username: context.body.username,
                                   password: context.body.password,
                                   role: [_role],

                               }).then((results) => {
                                   return {success: true}
                               })
                           } else {
                               context.body = "Role Is Not Valid"
                               return context.status = 401
                           }
                       }
                   }
               }
           }
        })
    })
}

module.exports = init