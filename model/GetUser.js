const request = new sql.Request();

request.query('SELECT * FROM KHACHHANG', function (err, recordset) {
    if (err) console.log(err);
    console.log(recordset);
});
