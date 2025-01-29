const express = require('express');

const app = express();
app.use(express.static('src'));
const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error)
        console.log(`Server is Successfully Running on localhost:${PORT}`)
    else 
        console.log("Error occurred, server can't start", error);
    }
);