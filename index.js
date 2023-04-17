const http = require("http")
const { v4 } = require("uuid")
const getBodyData = require("./util")

let books = [
    {
        id: '1',
        name: 'Book n1',
        age: 250,
    }
]

const server = http.createServer(async (req, res) => {
    // 
    if (req.url === '/books' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json charset=utf8'
        })

        const resp = {
            status: "Running: ...",
            books
        }

        res.end(JSON.stringify(resp))
    } else if (req.url === "/books" && req.method === "POST") {
        const data = await getBodyData(req)
        const { name, age } = JSON.parse(data)
        const newBook = {
            id: v4(),
            name,
            age
        }

        books.push(newBook)
        const resp = {
            status: 'Created',
            book: newBook
        }
        res.writeHead(200, {
            'Content-Type': 'application/json charset=utf8'
        })
        res.end(JSON.stringify(resp))
    } else if (req.url.match(/\/books\/\w+/) && req.method === 'GET') {
        const id = req.url.split('/')[2]
        const book = books.find(b => b.id === id)
        res.writeHead(200, {
            'Content-Type': 'application/json charset=utf8'
        })
        const resp = {
            status: 'OK',
            book
        }
        res.end(JSON.stringify(resp))
    } else if (req.url.match(/\/books\/\w+/) && req.method === "PUT") {
        const id = req.url.split("/")[2]
        const data = await getBodyData(req)
        const { name, age } = JSON.parse(data)
        const idx = books.findIndex(b => b.id === id)
        const changedBook = {
            id: books[idx].id,
            name: name || books[idx].name,
            age: age || books[idx].age,
        }
        books[idx] = changedBook
        res.writeHead(200, {
            'Content-Type': 'application/json charset=utf8'
        })
        const resp = {
            status: 'Created',
            book: changedBook
        }
        res.end(JSON.stringify(resp))
    } else if (req.url.match(/\/books\/\w+/) && req.method === "DELETE") {
        const id = req.url.split("/")[2]
        books = books.filter(b => b.id !== id)
        res.writeHead(200, {
            'Content-Type': 'application/json charset=utf8'
        })
        const resp = {
            status: 'Deleted'
        }
        res.end(JSON.stringify(resp))
    }
})
const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log("Running: "))