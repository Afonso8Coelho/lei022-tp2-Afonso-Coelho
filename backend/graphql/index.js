const fs = require('fs');
const path = require('path');
const { buildSchema, GraphQLError } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');

const schema = buildSchema(
    fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
);

function erro(message, code) {
    return new GraphQLError(message, { extensions: { code } });
}

function validarId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw erro('id inválido', 'BAD_USER_INPUT');
    }
}

function validarTexto(valor, campo) {
    if (valor.trim() === '') {
        throw erro(`${campo} não pode ser vazio`, 'BAD_USER_INPUT');
    }
}

module.exports = function criarHandlerGraphQL({ livros }) {
    const rootValue = {
        livros: ({ estado }) => {
            if (!estado) return livros;
            return livros.filter(l => l.estado === estado);
        },

        livro: ({ id }) => {
            validarId(id);
            const livro = livros.find(l => l.id === id);
            if (!livro) {
                throw erro(`Não existe livro com id ${id}`, 'NOT_FOUND');
            }
            return livro;
        },

        createLivro: ({ titulo, autor, estado }) => {
            validarTexto(titulo, 'titulo');
            validarTexto(autor, 'autor');

            const existe = livros.find(
                l => l.titulo.toLowerCase() === titulo.trim().toLowerCase()
            );
            if (existe) {
                throw erro('Já existe um livro com esse título', 'CONFLICT');
            }

            const novo = {
                id: livros.length ? Math.max(...livros.map(l => l.id)) + 1 : 1,
                titulo: titulo.trim(),
                autor: autor.trim(),
                estado,
                criadoEm: new Date().toISOString()
            };
            livros.push(novo);
            return novo;
        },

        updateLivro: ({ id, titulo, autor, estado }) => {
            validarId(id);
            const livro = livros.find(l => l.id === id);
            if (!livro) {
                throw erro(`Não existe livro com id ${id}`, 'NOT_FOUND');
            }

            validarTexto(titulo, 'titulo');
            validarTexto(autor, 'autor');

            const duplicado = livros.find(
                l => l.id !== id &&
                     l.titulo.toLowerCase() === titulo.trim().toLowerCase()
            );
            if (duplicado) {
                throw erro('Já existe um livro com esse título', 'CONFLICT');
            }

            livro.titulo = titulo.trim();
            livro.autor = autor.trim();
            livro.estado = estado;
            return livro;
        }
    };

    return createHandler({ schema, rootValue });
};