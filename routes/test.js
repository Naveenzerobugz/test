require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const logger = winston.createLogger(logconfig);
const purchase = require('../Controllers').purchase;

const PDFDocument = require('pdfkit');
 const blobStream = require('blob-stream');
 const fs = require('fs');
const doc = new PDFDocument();
 const stream = doc.pipe(blobStream());


router.get('/testpdfs', function (req, res) {
  
   //  doc.pipe(fs.createWriteStream('./public/pdf/invoice2.pdf'));
   doc
      .fontSize(15)
      .text('Invoice', 20, 20);

   doc
      .fontSize(15)
      .text('Zerobugz', 420, 20);
   doc
      .fontSize(8)
      .text('95, Nirmal Skywin Mall, Rajaji Road, Peramanur, Salem', {
         width: 200,
         align: 'left',
         // indent: 30,
         columns: 2,
         height: 300,
         ellipsis: true
      });
      doc.end();
      stream.on('finish', function() {
         var data = stream.toBlob("application/pdf");
         // var data = stream.toBlobURL('application/pdf');
         // res.contentType("application/pdf");
         res.send(data);
       });
      // var data =fs.readFileSync('./public/pdf/invoice2.pdf',{root: __dirname})
      // res.contentType("application/pdf");
		// res.send(data);
   // Finalize PDF file
    
   // stream.on('finish', function () {
   //    const blob = stream.toBlob('application/pdf');

   //    // or get a blob URL for display in the browser
   //    const url = stream.toBlobURL('application/pdf');
   //    iframe.src = url;
   //    res.send(url)
   // });

// res.send('success')
})



// //master Attribute
// router.post('/insertupdate', purchase.insert);
// router.get('/list', purchase.list);
// router.get('/edit/:_id', purchase.edit);
// router.get('/purchaseno', purchase.purchaseno);
// //  router.get('/master/attributeedit/:_id',Attribute.edit);
// router.post('/delete/:_id', purchase.delete);



// var pdf = require('html-pdf');
// var requestify = require('requestify');
// var externalURL = 'http://localhost:3000/test/sample';

// router.get('/testpdf', function (req, res) {
//    console.log('test pdf')
//    requestify.get(externalURL).then(function (response) {
//       // Get the raw HTML response body
//       var html = response.body;
//       var config = { format: 'A4' }; // or format: 'letter' - see https://github.com/marcbachmann/node-html-pdf#options

//       // Create the PDF
//       pdf.create(html, config).toFile('pathtooutput/sampl452.pdf', function (err, res) {
//          if (err) return console.log(err);
//          console.log(res); // { filename: '/pathtooutput/generated.pdf' }
//       });
//    });
// })
// router.get('/sample', function (req, res) {
//    res.render('./sample.ejs', { title: 'PurchaseEntry' });
// })



module.exports = router;