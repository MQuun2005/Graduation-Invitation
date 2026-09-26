const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/graduation-invitation/browser/index.html');

try {
  let content = fs.readFileSync(indexPath, 'utf8');
  content = content.replace(/<base href="[^"]*">/, '<base href="/Graduation-Invitation/">');
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✅ Base href đã được đảm bảo là /Graduation-Invitation/ cho GitHub Pages');
} catch (error) {
  console.error('❌ Lỗi khi sửa base href:', error.message);
  process.exit(1);
}
