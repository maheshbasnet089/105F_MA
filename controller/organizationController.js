const { QueryTypes } = require("sequelize")
const { sequelize, users } = require("../model")


exports.createOrganization = async(req,res,next)=>{
    const {name,address,email,number} = req.body
    const userId = req.userId

    const OrganizationNumber = Math.floor(1000+ Math.random() * 9000)



    await sequelize.query(`CREATE TABLE IF NOT EXISTS organization_${OrganizationNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        address VARCHAR(255),

        email VARCHAR(255),
        number VARCHAR(255),
        userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE

    )`,{
        type : QueryTypes.CREATE
    })

    const userData = await users.findByPk(userId)
    userData.currentOrganizationNumber = OrganizationNumber 
    await userData.save()
    await sequelize.query(`CREATE TABLE IF NOT EXISTS userHistory_${userId}(
        organizationNumber INT
    )`,{
        type : QueryTypes.CREATE
    })

    await sequelize.query(`INSERT INTO organization_${OrganizationNumber}(name,address,email,number,userId) VALUES(?,?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [name,address,email,number,userId]
    })

    await sequelize.query(`INSERT INTO userHistory_${userId}(organizationNumber) VALUES(?)`,{
        type : QueryTypes.INSERT,
        replacements: [OrganizationNumber]
    })

    req.userId = userId 
    req.organizationNumber = OrganizationNumber
    next()
}


exports.createBlogTable = async(req,res)=>{
   
    const organizationNumber = req.organizationNumber
    await sequelize.query(`CREATE TABLE blog_${organizationNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT,
        image VARCHAR(255),
        createdBy INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`,{
        type : QueryTypes.CREATE 

    })
    await sequelize.query(`INSERT INTO blog_${organizationNumber} (title,subtitle,description,image,createdBy) VALUES('seedtitle','test','desc','image',2)`,{
        type : QueryTypes.INSERT
    })
    res.status(200).json({
        message : "Users created successfully",
        orgNo : organizationNumber
    })
}


exports.deleteUser = async(req,res)=>{
    const userId = req.userId 
    const usersOrganizations = await sequelize.query(`SELECT organizationNumber FROM userHistory_${userId}`,{
        type : QueryTypes.SELECT
    })
    await sequelize.query(`DELETE FROM users WHERE id= ? `,{
        replacements : [userId],
        type : QueryTypes.DELETE
    })

    for ( var i = 0; i < usersOrganizations.length ; i ++){
        await sequelize.query(`DROP TABLE organization_${usersOrganizations[i].organizationNumber}`,{
            type : QueryTypes.DELETE,

        })
    }
    res.status(200).json({
        message : "ALl organization deleted"
    })
}


exports.createBlog  = async(req,res)=>{
    const userId = req.userId 
    const organizationNumber = req.organizationNumber
    await sequelize.query(`INSERT INTO blog_${organizationNumber}`)
}