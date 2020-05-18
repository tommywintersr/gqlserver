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
    /*
    TODO get user.links

    var index = links.findIndex((x) => x.id === args.id);
    if (index > -1) {
      links.splice(index, 1);
    }
    */
}

async function vote(parent, args, context, info) {
    // 1
    const userId = getUserId(context);

    // 2
    const voteExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId },
    });
    if (voteExists) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    // 3
    return context.prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
    });
}

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
    vote,
    post,
    updateLink,
    deleteLink,
};
