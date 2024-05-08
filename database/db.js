import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('savvy.db');

const init = () => {
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT,
                last_name TEXT,
                email TEXT
            );`,
            [],
            () => console.log('Users table created successfully'),
            (_, err) => console.log('Failed to create users table', err)
        );
    });
};

export const insertUser = async (firstName, lastName, email) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?);`,
                [firstName, lastName, email],
                (_, result) => {
                    console.log('User inserted successfully', result);
                    resolve(result);
                },
                (_, err) => {
                    console.error('Failed to insert user', err);
                    reject(err);
                }
            );
        });
    });
};

export const fetchUsers = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM users;`,
                [],
                (_, result) => resolve(result.rows._array),
                (_, error) => reject(error)
            );
        });
    });
};

export default init;
