const express = require("express")
const app = express()

const authRoute = require("./routes/authRoute")
const orgRoute = require("./routes/organizationRoute")

require("./model/index")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("",authRoute)
app.use("",orgRoute)



app.listen(3000,()=>{
    console.log('Server has started at port 3000')
})

// sudo /Applications/XAMPP/xamppfiles/xampp start