const db = require("../../models");
const User = db.user;
const UserPersonalInfo = db.userPersonalInfo
const UserFinancialInfo = db.userFinancialInfo

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a User
    const user = {
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullname,
        role: "ROLE_EMPLOYEE",
        active: true
    };

    // Save User in the database
    User.findOne({ where: { username: user.username } })
        .then(userExists => {
            if (!userExists) {
                User.create(user)
                    .then(data => {
                        let userData = {
                            userId: data.dataValues.id
                        }
                        UserPersonalInfo.create(userData)
                        .then(data => {
                            UserFinancialInfo.create(userData)
                            .then(data => {
                                res.send(data)
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the User."
                                }); 
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating the User."
                            }); 
                        })
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the User."
                        });
                    });
            } else {
                res.status(403).send({
                    message: "Username already exists"
                })
            }
        })
};