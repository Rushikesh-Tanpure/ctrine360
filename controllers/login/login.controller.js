const db = require("../../models");
const User = db.user;
const Department = db.department
const Op = db.Sequelize.Op;

// Login
exports.authenticate = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    User.findOne({
        where: { username: req.body.username},
        include: [{
            model: Department
        }]
    })
    .then(user => {
        if(user) {
            if(user.active) {
                if(req.body.password === user.password) {
                    let deptId = null
                    if (user.department) {
                        deptId = user.department.id
                    }
                    const userData = {
                        id: user.id,
                        username: user.username,
                        fullname: user.fullName,
                        role: user.role,
                        departmentId: deptId
                    }
                    req.session.user = userData;
                    res.status(200).send({
                        user: userData
                    });
                } else {
                    res.status(403).send({
                        message: "Incorrect Credentials!"
                    });
                }
            } else {
                res.status(403).send({
                    message: "Account is not active!"
                });
            }
        } else {
            res.status(403).send({
                message: "Incorrect Credentials!"
            });
        }
    });
};