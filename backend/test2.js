import('./src/db.js').then(async m => { console.log(await m.query("SELECT id, code FROM products")); process.exit(0); })
