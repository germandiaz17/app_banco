import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [cuentas, setCuentas] = useState({ accounts: [], transactions: [] });
    const [formData, setFormData] = useState({
        from_account: '',
        to_account: '',
        amount: ''
    });

    const fetchCuentas = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/banco');
            if (!response.ok) {
                throw new Error('Error al obtener los datos del servidor!');
            }
            const data = await response.json();
            setCuentas(data);
        } catch (error) {
            console.log('Error al obtener las cuentas!', error);
        }
    };

    useEffect(() => {
        fetchCuentas();
    }, []);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        try {
            const response = await fetch('http://localhost:3001/api/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Mandar los datos del formulario como JSON
            });

            if (!response.ok) {
                throw new Error('Error al realizar la transferencia!');
            }
            const result = await response.json();
            alert(result.message); // Mostrar un mensaje de éxito o error
            window.location.reload();
        } catch (error) {
            alert('Error al realizar la transferencia!');

        }
    };

    return (
        <>
            <div className="container">
                <h2>Transferencia Bancaria</h2>
                <form id="transactionForm" onSubmit={handleSubmit}>
                    <label htmlFor="from_account">Cuenta de Origen:</label>
                    <input
                        type="text"
                        name="from_account"
                        value={formData.from_account}
                        onChange={handleChange}
                    />

                    <label htmlFor="to_account">Cuenta de Destino:</label>
                    <input
                        type="text"
                        name="to_account"
                        value={formData.to_account}
                        onChange={handleChange}
                    />

                    <label htmlFor="amount">Monto a Transferir:</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />

                    <button type="submit">Realizar Transferencia</button>
                </form>

                <div className="message" id="message"></div>
            </div>

            {/* Tabla de cuentas */}
            <div className="container">
                <h2>Cuentas y montos existentes</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>Número de Cuenta</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuentas.accounts && cuentas.accounts.length > 0 ? (
                            cuentas.accounts.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.account_number}</td>
                                    <td>{account.balance}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No hay cuentas disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="container">
                <h2>Historial de Transacciones</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Cuenta de Origen</th>
                            <th>Cuenta de Destino</th>
                            <th>Monto</th>
                            <th>Fecha de Transacción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Verifica si 'transactions' existe y no está vacío antes de mapear */}
                        {cuentas.transactions && cuentas.transactions.length > 0 ? (
                            cuentas.transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.from_account_id}</td>
                                    <td>{transaction.to_account_id}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No hay transacciones disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
        </>
    );
}
export default App;