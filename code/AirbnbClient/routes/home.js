var ejs = require("ejs");
var tool = require("../utili/common");

function home(req,res) {
ejs.renderFile('./views/home.ejs',function(err, result) {
// render on success
if (!err) {
res.end(result);
}
// render or error
else {
	 tool.logError(err);
res.end('An error occurred');
console.log(err);
}
});
}

exports.home=home;