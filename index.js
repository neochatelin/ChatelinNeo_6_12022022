let express = require('express');
let app = express();
let port = 8080;
app.use(express.static("./public"));

app.get('/', (req, res)=>{
})

app.listen(port, ()=>{
    console.log("http://localhost:"+port);
});