const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();

app.use(express.json());

let peliculas = [
{"id": 1, 
"title": "Inception", 
"description": "Una película de ciencia ficción dirigida por Christopher Nolan", 
"votes": 0 
},
{ "id": 2, 
    "title": "Titanic", 
    "description": "Historia romántica dirigida por James Cameron",
"votes": 0 },
 {"id": 3, 
 "title": "The Matrix", 
 "description": "Película de acción y ciencia ficción dirigida por los hermanos Wachowski", 
"votes": 0 
}
]







app.get('/', (req, res) => {
  res.status(200).json({ message: 'Api peliculas funcionando correctamente' });
});

app.get('/peliculas', (req, res) => {
  res.status(200).json({ message: 'Lista de películas', data: peliculas });
});

app.post('/vote/:id', (req, res) => {
  const { id } = req.params;
  const pelicula = peliculas.find(p => p.id === parseInt(id));

  if (pelicula) {
    pelicula.votes += 1;
    res.status(200).json({ message: 'Voto registrado correctamente', data: pelicula });
  } else {
    res.status(404).json({ message: 'Película no encontrada' });
  }
});

app.get('/movie/:id', (req, res) => {
  const { id } = req.params;
  const pelicula = peliculas.find(p => p.id === parseInt(id));
  
  if (pelicula) {
    res.status(200).json({ message: 'Película encontrada', data: pelicula });
  } else {
    res.status(404).json({ message: 'Película no encontrada' });
  }
});

app.get('/result', (req, res) => {
    const resultados = [...peliculas].sort((a, b) => b.votes - a.votes);
    res.status(200).json(resultados);
});

// Agregar una nueva película
app.post('/peliculas', (req, res) => {
  const nueva = {
    id: peliculas.length
      ? Math.max(...peliculas.map(p => p.id)) + 1
      : 1,
    title: req.body.title,
    description: req.body.description,
    votes: 0
  };

  peliculas.push(nueva);
  res.status(201).json(nueva);
});


// Modificar una película
app.put('/peliculas/:id', (req, res) => {
  const pelicula = peliculas.find(p => p.id === parseInt(req.params.id));

  if (!pelicula) {
    return res.status(404).json({
      message: 'Película no encontrada'
    });
  }

  pelicula.title = req.body.title ?? pelicula.title;
  pelicula.description = req.body.description ?? pelicula.description;

  res.status(200).json(pelicula);
});


// Eliminar una película solo si no tiene votos
app.delete('/peliculas/:id', (req, res) => {
  const indice = peliculas.findIndex(p => p.id === parseInt(req.params.id));

  if (indice === -1) {
    return res.status(404).json({
      message: 'Película no encontrada'
    });
  }

  if (peliculas[indice].votes > 0) {
    return res.status(400).json({
      message: 'La película tiene votos y no se puede eliminar'
    });
  }

  res.status(200).json(peliculas.splice(indice, 1)[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

