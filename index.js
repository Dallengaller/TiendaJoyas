// index.js
import express from 'express';
import cors from 'cors';
import pool from './src/database/dbconfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

const logRequests = (req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} - ${req.originalUrl}\n`;
  const logFilePath = path.join(__dirname, 'access.log');

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error al registrar la solicitud:', err);
    }
  });

  next();
};

app.use(logRequests);

app.get('/home', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!');
});

app.get('/checkdb', async (req, res) => {
  try {
    const result = await pool.query('SELECT version()');
    res.send('Conexión a la base de datos establecida exitosamente.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

app.get('/joyas', async (req, res) => {
  try {
    const { limits, page, order_by } = req.query;

    const limit = limits ? parseInt(limits) : 10;
    const pageNumber = page ? parseInt(page) : 1;
    const orderBy = order_by ? order_by.split('_') : ['id', 'ASC'];

    const offset = (pageNumber - 1) * limit;

    const query = {
      text: `SELECT * FROM inventario ORDER BY ${orderBy[0]} ${orderBy[1]} LIMIT $1 OFFSET $2`,
      values: [limit, offset]
    };

    const result = await pool.query(query);
    const joyas = result.rows.map(joya => ({
      id: joya.id,
      nombre: joya.nombre,
      categoria: joya.categoria,
      metal: joya.metal,
      precio: joya.precio,
      stock: joya.stock,
      links: {
        self: `http://localhost:3000/joyas/${joya.id}`
      }
    }));

    res.json({
      count: joyas.length,
      joyas
    });
  } catch (error) {
    console.error('Error al obtener las joyas:', error);
    res.status(500).send('Error al obtener las joyas');
  }
});

app.get('/joyas/filtros', async (req, res) => {
  try {
    const { precio_max, precio_min, categoria, metal } = req.query;
    let filters = [];
    let values = [];
    let counter = 1;

    if (precio_max) {
      filters.push(`precio <= $${counter++}`);
      values.push(precio_max);
    }
    if (precio_min) {
      filters.push(`precio >= $${counter++}`);
      values.push(precio_min);
    }
    if (categoria) {
      filters.push(`categoria = $${counter++}`);
      values.push(categoria);
    }
    if (metal) {
      filters.push(`metal = $${counter++}`);
      values.push(metal);
    }

    const filterQuery = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const query = {
      text: `SELECT * FROM inventario ${filterQuery}`,
      values: values
    };

    const result = await pool.query(query);
    const joyas = result.rows.map(joya => ({
      id: joya.id,
      nombre: joya.nombre,
      categoria: joya.categoria,
      metal: joya.metal,
      precio: joya.precio,
      stock: joya.stock,
      links: {
        self: `http://localhost:3000/joyas/${joya.id}`
      }
    }));

    res.json({
      count: joyas.length,
      joyas
    });
  } catch (error) {
    console.error('Error al obtener las joyas filtradas:', error);
    res.status(500).send('Error al obtener las joyas filtradas');
  }
});

app.listen(3000, () => {
  console.log('¡Servidor encendido en el puerto 3000!');
});
