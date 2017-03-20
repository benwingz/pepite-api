var chokidar = require('chokidar');
var fs = require('fs');

var watcher = chokidar.watch('./postman-collections/*json', {
  persistent: true
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
  content += '\n\n###lancer le serveur: `node server.js`\n';
  content += '###lancer le watcher pour la mise à jour de la doc via postman: `node postman-watcher.js`\n';
  fs.writeFileSync('README.md', content);
}

var fileChanged = function(path) {
  console.log(`File ${__dirname}${path} Changed`);
  fs.readFile(__dirname + '/' + path, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      populateReadme(JSON.parse(data));
    }
  })
}

watcher.on('change', path => fileChanged(path));
