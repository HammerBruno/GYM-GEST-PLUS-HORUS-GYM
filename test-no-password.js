const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // ← VACÍO
            database: 'mysql'
        });
        
        console.log('✅ CONEXIÓN EXITOSA - Sin contraseña');
        
        // Verificar bases de datos
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('📊 Bases de datos disponibles:');
        databases.forEach(db => console.log('   - ' + db.Database));
        
        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testConnection();