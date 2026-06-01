import('./src/db.js').then(async m => { console.log(await m.query("SELECT MAX(CAST(code AS UNSIGNED)) AS max_code FROM products WHERE code REGEXP '^[0-9]+$'")); process.exit(0); })
