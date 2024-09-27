const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json()); 

// Crear una conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'banco',
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
    console.error('Error al conectar:', err.stack);
    return;
    }
    console.log('Conectado como id ' + connection.threadId);
});

// Ruta para obtener cuentas y transacciones
app.get('/api/banco', (req, res) => {
  const SQL_QUERY = 'SELECT * FROM accounts';
  const SQL_QUERY2 = 'SELECT * FROM transactions';

    connection.query(SQL_QUERY, (err, result) => {
    if (err) {
        throw err;
    }

    connection.query(SQL_QUERY2, (err2, result2) => {
        if (err2) {
        throw err2;
        }

        const combinedResult = {
        accounts: result,
        transactions: result2,
        };
        res.json(combinedResult);
    });
    });
});

// Ruta para realizar la transferencia
app.post('/api/transfer', (req, res) => {
    const { from_account, to_account, amount } = req.body;

    if (!from_account || !to_account || !amount) {
        console.error('Error al realizar la transferencia');
        return res.status(400).json({ error: 'Faltan datos para realizar la transferencia' });
    }

//Llamado al procedimiento almacenado
    const SQL_TRANSFER = `CALL transfer_money(?, ?, ?)`;

    connection.query(SQL_TRANSFER, [from_account, to_account, amount], (err, result) => {
    if (err) {
        console.error('Error al realizar la transferencia:', err);
        return res.status(500).json({ error: 'Error al realizar la transferencia' });
    }

    res.json({ message: 'Transferencia realizada con éxito!', result });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
