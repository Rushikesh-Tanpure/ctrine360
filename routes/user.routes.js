var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth")
const user = require("../controllers/user.controller.js");

// Create a new user
router.post('/', user.create);

// Retrieve all Users
router.get('/', withAuth.verifyToken, withAuth.withRoleAdminOrManager, user.findAll);

// Retrieve user count
router.get('/total', withAuth.verifyToken, withAuth.withRoleAdminOrManager, user.findTotal);

// Retrieve total users by department
router.get('/total/department/:id', withAuth.verifyToken, withAuth.withRoleManager, user.findTotalByDept);

// Retrieve all Users by Department Id
router.get('/department/:id', withAuth.verifyToken, user.findAllByDeptId);

// Change password
router.put('/changePassword/:id', withAuth.verifyToken, user.changePassword);

// Retrieve a single User with an id
router.get('/:id', withAuth.verifyToken, user.findOne);

// Update a User with id
router.put('/:id', withAuth.verifyToken, withAuth.withRoleAdmin, user.update);

// Delete a User with id
router.delete('/:id', withAuth.verifyToken, withAuth.withRoleAdmin, user.delete);

// Delete all Users
router.delete('/', withAuth.verifyToken, withAuth.withRoleAdmin, user.deleteAll);

module.exports = router;
