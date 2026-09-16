const fs = require('fs');
const path = require('path');

function checkFileCase(dir) {
    let files = fs.readdirSync(dir, { withFileTypes: true });
    for (let file of files) {
        let fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            checkFileCase(fullPath);
        } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let imports = content.match(/from\s+['"](.*?)['"]/g) || [];
            imports.forEach(imp => {
                let p = imp.replace(/from\s+['"]|['"]/g, '');
                if (p.startsWith('.')) {
                    let target = path.resolve(dir, p);
                    let targetDir = path.dirname(target);
                    let targetBase = path.basename(target);
                    try {
                        let actualFiles = fs.readdirSync(targetDir);
                        let exactMatch = actualFiles.find(f => {
                            if (f === targetBase) return true;
                            if (f === targetBase + '.js') return true;
                            if (f === targetBase + '.jsx') return true;
                            return false;
                        });
                        let caseInsensitiveMatch = actualFiles.find(f => {
                            if (f.toLowerCase() === targetBase.toLowerCase()) return true;
                            if (f.toLowerCase() === (targetBase + '.js').toLowerCase()) return true;
                            if (f.toLowerCase() === (targetBase + '.jsx').toLowerCase()) return true;
                            return false;
                        });
                        if (!exactMatch && caseInsensitiveMatch) {
                            console.log('CASE MISMATCH in ' + fullPath + ': imported ' + p + ' but actual file is ' + caseInsensitiveMatch);
                        }
                    } catch (e) {}
                }
            });
        }
    }
}
checkFileCase('./src');
