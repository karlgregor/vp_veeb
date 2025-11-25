const mysql = require('mysql2/promise')
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require('../dbInfo')

//loon andmebaasiühenduse
const dbConfig = {
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
};

const homePage = async (req, res) => {
    res.render("home");
}

module.exports = {
    homePage
}