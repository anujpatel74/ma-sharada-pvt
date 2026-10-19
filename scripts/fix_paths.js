const fs = require('fs');
const path = require('path');

// 1. Fix public/index.html
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

indexHtml = indexHtml.split('href="/css/').join('href="css/');
indexHtml = indexHtml.split('src="/images/').join('src="images/');
indexHtml = indexHtml.split('content="/images/').join('content="images/');
indexHtml = indexHtml.split('src="/js/').join('src="js/');
indexHtml = indexHtml.split('href="/admin').join('href="admin.html');

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Fixed paths in index.html');

// 2. Fix public/admin.html
const adminPath = path.join(__dirname, '..', 'public', 'admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

adminHtml = adminHtml.split('href="/css/').join('href="css/');
adminHtml = adminHtml.split('src="/js/').join('src="js/');
adminHtml = adminHtml.split('href="/"').join('href="index.html"');

fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log('Fixed paths in admin.html');
