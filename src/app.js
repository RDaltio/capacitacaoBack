import express from "express";

const app = express();

app.use(express.json())

let pokedex = [
    {id: 1, "pokemon_name": "Pikachu", attack: 55, defense: 40, hp: 35, pokedex_number: 1, speed: 50, "type": "Eletric", is_legendary: false, "createdAt": Date(), "updatedAt": Date()},
    {id: 2, "pokemon_name": "Machamp", attack: 130, defense: 80, hp: 90, pokedex_number: 2, speed: 65, "type": "Fighting", is_legendary: false, "createdAt": Date(), "updatedAt": Date()},
]

let nextId;

if (pokedex.length > 0) {
  nextId = pokedex.reduce((maxId, pokemon) => Math.max(maxId, pokemon.id), 0) + 1;
} else {
  nextId = 1;
}

app.get('/', (req, res) => {
    res.status(200).send('Pokedex');
})

app.get('/pokemons', (req, res) => {
    const { type, is_legendary } = req.query;

    if (type || is_legendary !== undefined) {
        let filteredPokemons = pokedex;

        if (type) {
          filteredPokemons = filteredPokemons.filter(pokemon => pokemon.type.toLowerCase() === type.toLowerCase());
        }

        if (is_legendary !== undefined) {
          filteredPokemons = filteredPokemons.filter(pokemon => pokemon.is_legendary === (is_legendary === 'true'));
        }

        if (filteredPokemons.length === 0) {
            if (type && is_legendary !== undefined) {
                res.status(404).send('Nenhum Pokémon correspondente encontrado para o tipo e lendário especificados.');
            } else if (type) {
                res.status(404).send('Nenhum Pokémon correspondente encontrado para o tipo especificado.');
            } else {
                res.status(404).send('Nenhum Pokémon lendário correspondente encontrado.');
            }
        } else {
            res.status(200).json(filteredPokemons);
        }
    } else {
        res.status(200).json(pokedex);
    }
})


app.get('/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = buscaPokemon(id);
    if (index !== -1) {
        res.json(pokedex[index]);
    }else {
        res.status(404).send("Pokemon não encontrado");
    }
})

app.post('/pokemons', (req, res) => {
    const { pokemon_name, attack, defense, hp, speed, type, is_legendary } = req.body;

    if (!pokemon_name || !attack || !defense || !hp || !speed || !type || is_legendary === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando' });
    }

    const newPokemon = {
        id: nextId,
        pokemon_name: req.body.pokemon_name,
        attack: req.body.attack,
        defense: req.body.defense,
        hp: req.body.hp,
        pokedex_number: nextId,
        speed: req.body.speed,
        type: req.body.type,
        is_legendary: req.body.is_legendary,
        createdAt: Date(),
        updatedAt: Date() 
    }

    pokedex.push(newPokemon);
    nextId++;

    res.status(201).send('Pokemon cadastrado com sucesso')
})

app.put('/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = buscaPokemon(id);
    if(index !== -1) {
        const { pokemon_name, attack, defense, hp, speed, type, is_legendary } = req.body;

        pokedex[index] = {
            id: id,
            pokemon_name,
            attack,
            defense,
            hp,
            pokedex_number: pokedex[index].pokedex_number,
            speed,
            type,
            is_legendary,
            createdAt: pokedex[index].createdAt,
            updatedAt: Date()
        };

        res.status(201).send('Pokemon atualizado com sucesso');
    }else {
        res.status(404).send('Pokemon não encontrado');
    }
});

app.patch('/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = buscaPokemon(id);
    if(index !== -1) {
        const { pokemon_name, attack, defense, hp, speed, type, is_legendary } = req.body;

        if (pokemon_name) {
            pokedex[index].pokemon_name = pokemon_name;
        }
        if (attack) {
            pokedex[index].attack = attack;
        }
        if (defense) {
            pokedex[index].defense = defense;
        }
        if (hp) {
            pokedex[index].hp = hp;
        }
        if (speed) {
            pokedex[index].speed = speed;
        }
        if (type) {
            pokedex[index].type = type;
        }
        if (is_legendary !== undefined) {
            pokedex[index].is_legendary = is_legendary;
        }

        pokedex[index].updatedAt = Date();

        res.status(201).send('Pokemon atualizado com sucesso');
    }else {
        res.status(404).send('Pokemon não encontrado');
    }
})

app.delete('/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = buscaPokemon(id);
    if (index !== -1){
    pokedex.splice(index, 1);
    res.send(`Pokemon ${id} removido com sucesso`);
    }else {
        res.status(404).send('Pokemon não encontrado');
    }
})

function buscaPokemon(id) {
    return pokedex.findIndex(pokemon => pokemon.id == id)
}

export default app