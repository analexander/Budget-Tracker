const indexedDB = window.indexedDB

// instantiate indexedDB, name of collection + version

const req = indexedDB.open('budget', 1);

// requests depending on what returns as status

req.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore('pending',  {autoIncrement: true} );
};

