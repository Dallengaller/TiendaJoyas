# Desafio Tienda de Joyas

# Ambos servidores corren por separados, ya sea con npm run dev y node index.js

# 1. Se ha creado una ruta GET /joyas que devuelve la estructura HATEOAS de todas las joyas almacenadas en la base de datos.

# Recibiendo en la query string los parametros: limitar cantidad, define pagina y ordenar. Se comprueba ingresando ej http://localhost:3000/joyas?limits=3&page=1&order_by=stock_ASC

# 2. Se ha creado una ruta GET /joyas/filtros que recibe los siguientes parámetros en la query

# 4. Se ha implementado try catch para capturar los posibles errores durante una consulta y la lógica de cada ruta creada. 

# 5. Se ha implementado las consultas parametrizadas para evitar el SQL Injection en la consulta a la base de datos relacionada con la ruta GET /joyas/filtros