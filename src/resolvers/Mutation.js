const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

function post(parent, args, context, info) {
    const userId = getUserId(context);

    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
    });
}

function updateLink(parent, args, context, info) {
    const userId = getUserId(context);

    return context.prisma.updateLink({
        url: args.url,
        description: args.description,
        id: args.id,
        postedBy: { connect: { id: userId } },
    });
}

function deleteLink(parent, args, context, info) {
    const userId = getUserId(context);
}

/*
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
*/

async function signup(parent, args, context, info) {
    const hashedPassword = await bcrypt.hash(args.password, 10);
    const { password, ...user } = await context.prisma.createUser({
        ...args,
        password: hashedPassword,
    });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

async function login(parent, args, context, info) {
    const { password, ...user } = await context.prisma.user({
        email: args.email,
    });
    if (!user) {
        throw new Error("No such user found");
    }

    const valid = await bcrypt.compare(args.password, password);
    if (!valid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

module.exports = {
    signup,
    login,
    post,
    updateLink,
    deleteLink,
};
