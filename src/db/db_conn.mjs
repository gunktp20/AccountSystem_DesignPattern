import mysql from 'mysql2'
import mysql_config_obj from '../config/db.config.mjs';

let instance;

class DBConnSingleton {

    constructor() {
        if (instance) {
            throw new Error(
                'Already init'
            )
        }
        this.conn = mysql.createConnection(mysql_config_obj)
        instance = this;
    } 

    static getInstance() {
        if (!instance) {
            instance = new DBConnSingleton();
        }
        return instance;
    }

}

export default DBConnSingleton;