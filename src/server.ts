import {default as express} from 'express'
import {Express} from 'express-serve-static-core'
import {default as bodyParser} from 'body-parser'
import {default as swaggerUi} from 'swagger-ui-express'

import {default as swaggerDocument} from './json/swagger.json'
import {default as movies} from './json/movies.json'

export async function createServer(): Promise<Express> {
    const app = express()

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get('/', (req, res) => {
        const titles = movies.map(movie => movie.Title);
        res.json(titles);
    })
    app.get('/:Title/director', (req, res) => {
        const title = req.params["Title"];
        const movie = movies.find(movie => movie.Title.toLocaleLowerCase() === title.toLocaleLowerCase());
        if (!movie) {
            res.status(404).send("Movie not found"); return;
        }
        if (!movie.Director) {
            res.status(404).send("Movie does not have a stated director"); return;
        }
        res.json(movie.Director);
    })

    app.post('/:Title', (req, res) => {
        const title = req.params["Title"];
        const movie = movies.find(movie => movie.Title.toLocaleLowerCase() === title.toLocaleLowerCase());
        if (movie) {
            res.status(403).send("Movie already exists");
        }
        movies.push({
            ...req.body,
            Title: title,
        });
        res.status(200).send(`Movie '${title}' successfully added to list`);
    })
    return app
}
