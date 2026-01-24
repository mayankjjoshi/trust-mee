/**
 * TRUST MEE - Build Script
 * Run: npm run build
 *
 * This script:
 * 1. Minifies CSS (using clean-css)
 * 2. Minifies JS (using terser)
 * 3. Generates optimized file sizes report
 */

const fs = require('fs');
const path = require('path');

// Get file size in KB
function getFileSizeKB(filepath) {
    const stats = fs.statSync(filepath);
    return (stats.size / 1024).toFixed(2);
}

// Main build function
async function build() {
    console.log('🔨 TRUST MEE Build Script\n');
    console.log('='.repeat(50));

    // Paths
    const cssPath = path.join(__dirname, 'css', 'styles.css');
    const cssMinPath = path.join(__dirname, 'css', 'styles.min.css');
    const jsPath = path.join(__dirname, 'js', 'app.js');
    const jsMinPath = path.join(__dirname, 'js', 'app.min.js');

    // Check for clean-css
    let CleanCSS;
    try {
        CleanCSS = require('clean-css');
    } catch (e) {
        console.log('⚠️  clean-css not installed. Run: npm install clean-css terser');
        console.log('   Falling back to copy (no minification)\n');
        fs.copyFileSync(cssPath, cssMinPath);
        fs.copyFileSync(jsPath, jsMinPath);
        console.log('   Files copied without minification.');
        return;
    }

    // Check for terser
    let terser;
    try {
        terser = require('terser');
    } catch (e) {
        console.log('⚠️  terser not installed. Run: npm install terser');
        console.log('   Falling back to copy for JS\n');
    }

    // Minify CSS
    console.log('\n📦 Minifying CSS...');
    const cssOriginal = fs.readFileSync(cssPath, 'utf8');
    const cssResult = new CleanCSS({ level: 2 }).minify(cssOriginal);

    if (cssResult.errors.length > 0) {
        console.log('   ❌ CSS Errors:', cssResult.errors);
    }

    fs.writeFileSync(cssMinPath, cssResult.styles);
    console.log(`   Original: ${getFileSizeKB(cssPath)} KB`);
    console.log(`   Minified: ${getFileSizeKB(cssMinPath)} KB`);
    console.log(`   Saved: ${(getFileSizeKB(cssPath) - getFileSizeKB(cssMinPath)).toFixed(2)} KB (${((1 - getFileSizeKB(cssMinPath) / getFileSizeKB(cssPath)) * 100).toFixed(1)}%)`);

    // Minify JS
    console.log('\n📦 Minifying JavaScript...');
    const jsOriginal = fs.readFileSync(jsPath, 'utf8');

    if (terser) {
        const jsResult = await terser.minify(jsOriginal, {
            compress: true,
            mangle: true
        });

        if (jsResult.error) {
            console.log('   ❌ JS Error:', jsResult.error);
            fs.copyFileSync(jsPath, jsMinPath);
        } else {
            fs.writeFileSync(jsMinPath, jsResult.code);
        }
    } else {
        fs.copyFileSync(jsPath, jsMinPath);
    }

    console.log(`   Original: ${getFileSizeKB(jsPath)} KB`);
    console.log(`   Minified: ${getFileSizeKB(jsMinPath)} KB`);
    console.log(`   Saved: ${(getFileSizeKB(jsPath) - getFileSizeKB(jsMinPath)).toFixed(1)} KB (${((1 - getFileSizeKB(jsMinPath) / getFileSizeKB(jsPath)) * 100).toFixed(1)}%)`);

    // Image report
    console.log('\n📷 Image Size Report:');
    console.log('-'.repeat(50));

    const imageDir = path.join(__dirname, 'assets', 'images');
    const largeImages = [];

    function scanImages(dir) {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filepath = path.join(dir, file);
            const stat = fs.statSync(filepath);
            if (stat.isDirectory()) {
                scanImages(filepath);
            } else if (/\.(png|jpg|jpeg|webp|jfif)$/i.test(file)) {
                const sizeKB = stat.size / 1024;
                if (sizeKB > 100) {
                    largeImages.push({ path: filepath.replace(__dirname, '.'), size: sizeKB });
                }
            }
        }
    }

    scanImages(imageDir);

    if (largeImages.length > 0) {
        console.log('   ⚠️  Large images (>100KB) that should be optimized:');
        largeImages.sort((a, b) => b.size - a.size);
        for (const img of largeImages) {
            console.log(`   - ${img.path}: ${img.size.toFixed(0)} KB`);
        }
        console.log('\n   💡 Tip: Convert PNG/JPG to WebP to reduce size by 50-80%');
        console.log('   💡 Use: https://squoosh.app or sharp npm package');
    } else {
        console.log('   ✅ All images are under 100KB');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Build complete!\n');
}

build().catch(console.error);
