
const express = require('express');
const cors = require('cors');
const app = express();
const sql = require('mssql');
const moment = require('moment');

require('dotenv/config');
const bodyParser = require('body-parser');

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Import Routes
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);

// Routes
// get , post, path, delete

app.get('/', (req, res) => {
    res.send("Hello world")
})


// connect to Database
var config = {
    user: "sa",
    password: "1",
    server: "DESKTOP-OINCPGM\\CSDLPTNHOM6",
    database: "QLyPhongGYM",
    encrypt: false,
}

const pool = new sql.ConnectionPool(config);

// =============================Get all Client==================================
app.get('/api/client', (req, res) => {
    pool.connect((err) => {
        if (err) {
            console.log('Error connecting to SQL Server:', err);
        } else {
            console.log('Connected to SQL Server');
            pool.request().query('SELECT * FROM dbo.KHACHHANG', (err, result) => {
                if (err) {
                    console.log('Error executing query:', err);
                } else {
                    console.log(result.recordset);
                    return res.json(result.recordset);
                }
                pool.close();
            });
        }
    });
});

// =============================Get Client by maKH====================================
app.get('/api/getDetailClient/:maKH', (req, res) => {
    const maKH = req.params.maKH;

    pool.connect(err => {
        if (err) {
            console.log('Error connecting to SQL Server:', err);
            return res.status(500).json({ error: 'Error connecting to SQL Server' });
        }

        console.log('Connected to SQL Server');
        const request = pool.request();
        request.input('maKH', maKH);
        request.query('SELECT * FROM dbo.KHACHHANG WHERE maKH = @maKH', (err, result) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).json({ error: 'Error executing query' });
            }

            console.log('Query executed successfully');
            return res.json(result.recordset[0]);
        });
    });
});

// =============================Update Client by maKH==================================
app.put('/api/updateClient/:maKH', (req, res) => {
    const maKH = req.params.maKH;
    const client = req.body;
    const ngaySinh = moment(client.ngaySinh).format('YYYY-MM-DD');
    pool.connect((err) => {
        if (err) {
            console.log('Error connecting to SQL Server:', err);
            return res.status(500).json({ error: 'Error connecting to SQL Server' });
        } else {
            console.log('Connected to SQL Server');
            pool.request()
                .input('tenKH', sql.NVarChar, client.tenKH)
                .input('ngaySinh', sql.Date, new Date(client.ngaySinh))
                .input('gioiTinh', sql.NVarChar, client.gioiTinh)
                .input('diaChi', sql.NVarChar, client.diaChi)
                .input('soDT', sql.NVarChar, client.soDT)
                .query(`
              UPDATE dbo.KHACHHANG
              SET
                tenKH = @tenKH,
                ngaySinh = @ngaySinh,
                gioiTinh = @gioiTinh,
                diaChi = @diaChi,
                soDT = @soDT
              WHERE maKH = '${maKH}'
            `, (err, result) => {
                    if (err) {
                        console.log('Error executing query:', err);
                        return res.status(500).json({ error: 'Error executing query' });
                    } else {
                        console.log(`Updated ${result.rowsAffected} row(s)`);
                        return res.json({ success: true });
                    }
                    pool.close();
                });
        }
    });
});

// Listen
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001")
})
