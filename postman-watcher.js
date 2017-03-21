//console.log(process.env.PATH);
var fs = require('fs');

fs.readFile(__dirname + '/' + process.env.path, function(err, data) {
  if(err) {
    console.log(err);
  } else {
    populateReadme(JSON.parse(data));
  }
});

var populateReadme = function(data) {
  var content = "";
  content += '# ' + data.info.name + ':\n\n';
  content += '## API endpoints list:\n';
  for(var i=0; i < data.item.length ; i++) {
    content += '* **' + data.item[i].name + "**\n";
    content +='** ' + data.item[i].request.description + '**\n';
    if(data.item[i].response.length > 0) {
      content += '    * Output exemple:\n';
      content += '```\n' + data.item[i].response[0].body + '\n```\n';
    }
  }
  content += '\n\n### lancer le serveur: `node server.js`\n';
  console.log(content);
  fs.writeFileSync('README.md', content);
  process.exit();
}
