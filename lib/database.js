import Datastore from 'nedb';

/**
 * Create two data stores using NeDB:
 * 1) 'terms.db' to store the terms already calculated
 * 2) 'pi.db' to store the accumulated value of pi
 */
const db = {};
db.terms = new Datastore('data/terms.db');
db.pi = new Datastore('data/pi.db');

db.terms.loadDatabase();
db.pi.loadDatabase();

export default db;
