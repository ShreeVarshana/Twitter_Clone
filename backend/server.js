const express = require("expres")

const app = express()

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(3000, () => {
    console.log("Server is running on the port 3000")
})