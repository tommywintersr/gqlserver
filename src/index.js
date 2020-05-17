const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            return context.prisma.links();
        },
    },
    Mutation: {
        post: (root, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description,
            });
        },
    },
};
const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: { prisma },
});
server.start(() => console.log("Server is running on port 4000"));

/*
const resolvers = {
  Query: {
    info: () => "Welcome to Train API",
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      if (args.id) {
        if (args.url) {
          links.find((x) => x.id === args.id).url = args.url;
        }
        if (args.description) {
          links.find((x) => x.id === args.id).description = args.description;
        }
      }
    },
    deleteLink: (parent, args) => {
      if (args.id) {
        var index = links.findIndex((x) => x.id === args.id);
        if (index > -1) {
          links.splice(index, 1);
        }
      }
    },
  },
};
*/
