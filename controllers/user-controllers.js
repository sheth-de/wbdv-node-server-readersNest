const usersDao = require("../daos/users-dao");

module.exports = (app) => {

    /*const createUser = (req, res) => {
         const user = new usersModel(req.body);
         user.save()
             .then( user => {
                 res.send("user saved to the database");
             })
    }
*/
    const findAllUsers = (req, res) => {
        // const quizzes = quizzesService.findAllQuizzes()
        // res.send(quizzes)
        usersDao.findAllUsers()
            .then((users) => {
                res.send(users)
            })
    }

    const register = (req, res) => {
        const credentials = req.body;
        console.log("body",credentials.userName)
//        console.log("body check kar bhai username", credentials.username)
        usersDao.findUserByUsername(credentials.userName)
            .then((actualUser) => {
                console.log(actualUser.length + "Bhai actual user dekh")
//                if(actualUser !==undefined ) {
                if(actualUser.length > 0) {
                    console.log( credentials.userName + " User registered Mila bhai")
                    res.send("0")
                }else {
                    usersDao.createUser(credentials)
                        .then((newUser) => {
                        console.log({credentials} + "REgistered ke Details check kar bhai")
                            req.session['profile'] = newUser
                            res.send(newUser)
                        })
                }
            })
    }
    const login = (req, res) => {
        const credentials = req.body;
        console.log("body",credentials)
        usersDao.findUserByCredentials(credentials)
            .then((actualUser) => {
                if(actualUser) {
                    console.log("User login mai Mila bhai")
                    actualUser["password"]=undefined
                    console.log("deleted password",actualUser)
                    req.session['profile'] = actualUser
                    res.send(actualUser)
                } else {
                    res.send("0")
                }
            })
    }

    const profile = (req, res) => {
        const currentUser = req.session["profile"]
        res.send(currentUser)
    }

    const updateUser=(req,res)=>{
        // const userId=req.params['uid'];
        const credentials = req.body;
        // credentials["_id"]=undefined;
        const userId=credentials._id;
        console.log("body",credentials._id);
        // let oldUser=null;
        // usersDao.findUserById(userId)
        //     .then((old_user)=>{
        //         // res.send(old_user)
        //         oldUser=old_user
        //     })
        if(userId!==null){
            console.log('I am here');
            usersDao.updateUser(userId,credentials)
                .then((user)=>{
                    console.log(user.n)
                    if(user.n===1)
                        res.json(credentials)
                    else
                        res.json("msg: there was some issue")
                })
        }
        else{
            console.log('No such user exists');
        }
    }

    const deleteUser=(req,res) =>{
        const credentials = req.body;
        // credentials["_id"]=undefined;
        const userId=credentials._id;
        if(userId!==null){
            usersDao.deleteUser(userId)
                .then(()=>{
                    res.send("Deleted Successfully");
                })
        }
        else{
            console.log('No such user exists');
        }
    }
    const logout = (req, res) => {
        const credentials = req.session['profile'];
        console.log("logout body",credentials);
        if (credentials) {
            req.session.destroy();
            res.clearCookie('connect.sid') // clean up
            return res.json({ msg: 'logging you out' })
        } else {
            return res.json({ msg: 'no user to log out!' })
        }
//      req.logout();
//        req.session.destroy(function(err) {
//            req.logOut();
//            res.redirect("/");
//          });
    };

    app.get("/api/users", findAllUsers);
    app.post("/api/users/profile", profile);
    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.put("/api/users/update",updateUser);
    app.delete("/api/users/delete",deleteUser);

}