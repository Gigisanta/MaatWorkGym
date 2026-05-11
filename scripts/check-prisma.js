const path = require('path');
const fs = require('fs');
const prismaDefaultPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'default.d.ts');
const content = fs.readFileSync(prismaDefaultPath, 'utf8');
console.log('File size:', content.length);
console.log('Has AdminModel:', content.includes('AdminModel'));
console.log('Has SessionModel:', content.includes('SessionModel'));

const lines = content.split('\n');
const modelLines = lines.filter(l => l.includes('Model') || l.includes('admin') || l.includes('session'));
console.log('Model-related lines:', modelLines.slice(0, 30));
