import {ApolloServer, UserInputError, gql} from 'apollo-server';
import {v1 as uuid} from 'uuid';

const persons = [
    {
        name: "Midu",
        age: "23",
        phone: "123456789",
        street: "Calle Frontend",
        city: "Barcelona",
        id: "sda3s2d165as1d65a-d32as1d32as-1sa3d213as2d"
    },
    {
        name: "Pepe Parada",
        age: "25",
        phone: "123456789",
        street: "Calle Back",
        city: "Madrid",
        id: "asdsad987-789789745sad-sadas3d189q"
    },
    {
        name: "Justo Ponar",
        age: "17",
        street: "Calle Fullstack",
        city: "Vigo",
        id: "dsaderw89779-65465dsfsdf-asdasv23cx1v3"
    },
];

const typeDefinitions = gql`

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        street: String!
        city: String!
        id: ID!
        address: Address!
        canDrink: Boolean
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
    }

`

const resolvers = {
    Query: {
        personCount: () => {
            return persons.length;
        },
        allPersons: () => persons,
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation: {
        addPerson: (root, args) => {

            if(persons.find(p => p.name === args.name)) {
                throw new UserInputError('Names must be unique.', {
                    invalidArgs: args.name
                })
            }
            // const {name, phone, street, city} = {args}
            const person = {...args, id: uuid()}
            persons.push(person)
            return person
        }
    },
    Person: {
        canDrink: (root) => root.age > 18,
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})