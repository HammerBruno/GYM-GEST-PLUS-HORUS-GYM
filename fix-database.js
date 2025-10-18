const mysql = require('mysql2/promise');

async function fixDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // vacío para XAMPP
            database: 'gymgestplus'
        });

        console.log('🔧 Verificando y corrigiendo estructura de la base de datos...');

        // Verificar y agregar columna sexo si no existe
        const tables = ['clientebasico', 'clienteacom', 'clientesemi', 'clienteperso'];
        
        for (const table of tables) {
            // Verificar si la columna sexo existe
            const [columns] = await connection.execute(
                `SHOW COLUMNS FROM ${table} LIKE 'sexo'`
            );
            
            if (columns.length === 0) {
                console.log(`✅ Agregando columna 'sexo' a la tabla ${table}`);
                await connection.execute(
                    `ALTER TABLE ${table} ADD COLUMN sexo VARCHAR(20) AFTER edad`
                );
            } else {
                console.log(`✅ La tabla ${table} ya tiene la columna 'sexo'`);
            }
        }

        console.log('🎉 Base de datos verificada y corregida correctamente');
        await connection.end();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixDatabase();