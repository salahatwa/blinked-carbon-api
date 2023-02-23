
var express = require('express');
const carbone = require('blinked-carbon');
var fs = require("fs");
var mime = require('mime');
var bodyParser = require('body-parser');
const { Readable } = require('stream');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let options = {
  convertTo: 'pdf' //can be docx, txt, ...
}

app.post('/api/template/render', function (req, res) {
  var template = req.body.template;
  var templatePath = template.templatePath;
  var fileName = template.fileName;
  var mimetype = template.mimetype;
  var data = req.body.content.data;

  try {
    //options
    carbone.render(templatePath, data, function (err, result) {
      if (err) return console.log(err);

      // console.log(result instanceof Buffer);

      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      if (mimetype)
        res.setHeader('Content-type', mimetype);

      const stream = Readable.from(result);
      stream.pipe(res);

      // fs.writeFileSync('./result.pdf', result);
      // fs.writeFileSync(fileName, result);
      console.log("File has been Generated successfully", fileName);
    });
  } catch (e) {
    const errorMsg = {
      message: "Coudn't render template",
      error: e
    }
    return res.send(errorMsg);
  }

});

const PORT = process.env.PORT || 8081;


var server = app.listen(PORT, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://127.0.0.1:%s", host, port)
})





