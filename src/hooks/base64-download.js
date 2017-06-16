var fs = require('fs');

module.exports = function() {
  return function(hook) {
    var buf = Buffer.from(hook.data.img.substring(22), 'base64');
    fs.open("images/"+hook.data.frase+".png", 'w', (err, fd) => {
      if(err) {
        return console.log(err);
      }
    });

    fs.writeFile("images/"+hook.data.frase+".png", buf, (err2) => {
      if(err2) {
          return console.log(err2);
      }
      hook.data.img = "images/"+hook.data.frase+".png";
    });
  }
}
