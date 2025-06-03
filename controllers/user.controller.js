const db = require("../models");
const User = db.user;
const UserPersonalInfo = db.userPersonalInfo;
const UserFinancialInfo = db.userFinancialInfo;
const Department = db.department;
const Job = db.job
const Payment = db.payment;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    console.log(req.body)
    // Create a User
    const user = {
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullname,
        role: req.body.role,
        active: true,
        departmentId: req.body.departmentId
    };

    // Save User in the database
    User.findOne({ 
        where: { username: user.username } 
    })
        .then(userExists => {
            if (!userExists) {
                User.create(user)
                    .then(data => {
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

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.findAll({
        include: [{
            model: UserPersonalInfo
        }, {
            model: UserFinancialInfo
        }, {
            model: Department
        }, {
            model: Job
        }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Users."
            });
        });
};

// Retrieve all Users from the database.
exports.findTotal = (req, res) => {
    User.count()
        .then(data => {
            res.send(data.toString());
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Users."
            });
        });
};

// Retrieve all Users from the database.
exports.findTotalByDept = (req, res) => {
    const id = req.params.id
    
    User.count({
        where: {departmentId: id}
    })
        .then(data => {
            res.send(data.toString());
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Users."
            });
        });
};


// Retrieve all Users by Department Id
exports.findAllByDeptId = (req, res) => {
    const departmentId = req.params.id;

    User.findAll({ 
        where: { departmentId: departmentId },
        include: [{
            model: UserPersonalInfo
        }, {
            model: UserFinancialInfo
        }, {
            model: Department
        }, {
            model: Job
        }] 
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Users from the Organization wiht Id:" + organizationId
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findOne({
        include: [{
            model: UserPersonalInfo
        }, {
            model: UserFinancialInfo
        }, {
            model: Department
        }, {
            model: Job,
            include: [{
                model: Payment
            }]
        }],
        where: {
            id: id
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe Organization was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};

// Change password
exports.changePassword = (req, res) => {
    const id = req.params.id;
    const newPassword = req.body.password;

    if (!newPassword) {
        res.status(400).send({
            message: "New password cannot be empty!"
        });
        return;
    }

    User.update({ password: newPassword }, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Password was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update password for user with id=${id}. Maybe user was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating password for user with id=" + id
            });
        });
};