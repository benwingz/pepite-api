//console.log(process.env.PATH);
var fs = require('fs');

console.log('PATH', process.env.PATH);

fs.readFile(__dirname + '/' + process.env.PATH, function(err, data) {
  if(err) {
    console.log(err);
  } else {
    console.log(data);
    populateReadme(JSON.parse(data));
  }
});

var populateReadme = function(data) {
  var content = "";
  content += '# ' + data.info.name + ':\n\n';
  content += '## API endpoints list:\n';
  for(var i=0; i < data.item.length ; i++) {
    content += '* **' + data.item[i].name + "**\n";
    if(data.item[i].response.length > 0) {
      content += '    * Output exemple:\n';
      content += '```\n' + data.item[i].response[0].body + '\n```\n';
    }
  }
  content += '\n\n### lancer le serveur: `node server.js`\n';
  console.log(content);
  fs.writeFileSync('README.md', content);
}
