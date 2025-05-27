require('dotenv').config();
const
    express = require('express'),
    app = express(),
    pg = require('pg'),
    PORT = process.env.PORT || 3000,
    DATABASE = process.env.DATABASE_URL,
    client = new pg.Client(DATABASE);


app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname + '/front-end/')); // to see the files like css

app.listen(PORT , () =>  `listening on port ${PORT}`);

app.get('/' , (req , res) => {
    res.sendFile(__dirname + "/front-end/index.html" );
    console.log("Path opened now from someone ");
});

app.get('/postMessage' , (req , res) => {
    client.query('select * from messagestable;').then(myTableResult => {
        res.json(myTableResult.rows);
    })
} );

app.post('/sendMessage' , ( req , res ) => {
    const inputsTaken = [req.body.username , req.body.chatMessage];
    const sqlSentence = `insert into messagestable (name , message) values ($1, $2) ;`;
    client.query(sqlSentence , inputsTaken).then( () => {
        console.log("new data added to table !!");
    })
    .then(() => {
        console.log("Page reloaded!");
        res.redirect('/');
    })
})

app.get('/deleteAll', (req , res) =>{
    console.log("Dropping table: messagestable !")
    client.query("drop table messagestable;")
    .then( () => {
        console.log("Creating table: messagestable !");
        client.query('create table messagestable (name varchar(255) , message varchar(255)) ; ')
        .then( () => {
            console.log("Table created successfully !");
            console.log(" res.redirect('/') ");
            res.redirect('/');
        })
    })
})


client.connect().then( function(){
    console.log("Connected successfully to Database : railway");
})

