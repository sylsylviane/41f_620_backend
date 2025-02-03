const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const serveur = http.createServer((req, res)=>{
    if(req.method=='GET' && req.url=='/'){
        res.end('Accueil');
    }else{
        res.end('Patate 2');
    }
});

//node utilise généralement les port 3000 à 3500
serveur.listen(process.env.PORT, ()=>{
    console.log(`Le serveur est démarré sur le port ${process.env.PORT}`);
    
})
