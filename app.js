const express = require('express'),
      bodyParser = require('body-parser'),
      jwt = require('jsonwebtoken'),
      config = require('./configs/config'),
      app = express();
// 1
app.set('llave', config.llave);
// 2
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json());
// 4
app.listen(3000,()=>{
    console.log('Servidor iniciado en el puerto 3000') 
});
// 5
app.get('/', function(req, res) {
    res.send('Inicio');
});

app.get('/verificar', function(req, res) {

   try {
    if(req.headers.token){
        var decoded = jwt.verify(req.headers.token, config.llave);
        if(decoded.check){
            console.log(`token-decoded : ${JSON.stringify(decoded)}`);
            console.log(`fecha expiración: ${new Date(decoded.exp)}`);
            res.status(200).json({"check":"welocome"})
        }
    }
    res.status(403).json({"check":"access denied"})  
   } catch (error){
    res.status(403).json(
        {
            "check":"the token expired or does not exist",
            "ERROR": error
        }) 
   }
   
});


app.post('/autenticar', (req, res) => {
    if(req.body.usuario === "juan" && req.body.contrasena === "holamundo") {
        const payload = {
        check:  true
        };
        const token = jwt.sign(payload, app.get('llave'), {
        expiresIn: 1440
        });
        res.json({
            mensaje: 'Autenticación correcta',
            token: token
        });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos"})
    }
})