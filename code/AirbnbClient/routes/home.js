var ejs = require("ejs");

function home(req,res) {
ejs.renderFile('./views/home.ejs',function(err, result) {
// render on success
if (!err) {
res.end(result);
}
// render or error
else {
res.end('An error occurred');
console.log(err);
}
});
}

exports.home=home;