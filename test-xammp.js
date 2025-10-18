const mysql = require('mysql2/promise');

async function testXAMPP() {
    console.log('🔍 Probando conexiones comunes de XAMPP...\n');
    
    const configs = [
        { user: 'root', password: '', desc: 'Sin contraseña' },
        { user: 'root', password: 'root', desc: 'Contraseña "root"' },
        { user: 'root', password: 'password', desc: 'Contraseña "password"' }
    ];
    
    for (const config of configs) {
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: config.user,
                password: config.password,
                database: 'mysql' // probamos con la BD por defecto
            });
            
            console.log(`✅ ${config.desc} - CONEXIÓN EXITOSA`);
            console.log(`   Usuario: ${config.user}, Contraseña: "${config.password}"`);
            
            // Verificar si existe la base de datos gymgestplus
            const [dbs] = await connection.execute('SHOW DATABASES LIKE "gymgestplus"');
            if (dbs.length > 0) {
                console.log('   ✅ Base de datos "gymgestplus" existe');
            } else {
                console.log('   ❌ Base de datos "gymgestplus" NO existe');
            }
            
            await connection.end();
            break; // Si una funciona, paramos
            
        } catch (error) {
            console.log(`❌ ${config.desc} - Falló: ${error.code}`);
        }
    }
}

testXAMPP();