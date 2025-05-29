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

app.get('/' , (req , res) => {
    console.log(`someone entered his ip:${req.ip}`);
    res.sendFile(__dirname + '/front-end/index.html');
});

app.use(express.static(__dirname + '/front-end/')); // to see the files like css

app.listen(PORT , () => {
    console.log(`listening on port ${PORT}`);
});

app.get('/postMessage' , (req , res) => {
    client.query('select * from messagestable;').then(myTableResult => {
        res.json(myTableResult.rows);
    })
} );

app.post('/validationPage' , (req , res) => {
    if (req.body.password === "omartegar"){
        console.log("password entered right!");
        res.redirect('/');
    } else {
        console.log(`wrong password : ${req.body.password}`);
        res.redirect('/validationPage.html');
    }
} );
 
app.post('/sendMessage' , ( req , res ) => {
    // console.log information for each person post a message in chat
    console.log("Someone sent a message button , Details :");
    console.log(`His name:${req.body.username} , his message:${req.body.chatMessage} , his ip:${req.ip.slice(7)} `);
    console.log(`rawHeaders =====>>>>  ${req.rawHeaders}`);
    const dataofperson = (`rawHeaders of this ==>  ${req.rawHeaders} `);

    
    const inputsTaken = [req.body.username , req.body.chatMessage , dataofperson];
    const sqlSentence = `insert into messagestable (name , message , data) values ($1, $2, $3) ;`;
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
        client.query('create table messagestable (name varchar(255) , message text , data text ) ; ')
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

