import {createServer} from "./server"

createServer()
    .then(server => {
        server.listen(5000, () => {
            console.info("listening on http://localhost:5000");
        })
    })
    .catch(err => {
        console.error(err);
    })
