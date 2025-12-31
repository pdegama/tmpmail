import { Context } from "hono";
import jwt from "jsonwebtoken"
import { env } from "../env";
import { Users } from "../models/users";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const getMailBoxUser = async (c: Context) : Promise<User> => {
    // @ts-ignore
    const authToken = c.req.header('Authorization')?.split[" "][1];
    return getUser(authToken || c.req.query("t"))
}

export type User = {
    token: string,
    mailBox: string,
    expiredOn: Date,
}

const getUser = async (token: string | undefined): Promise<User> => {
    const userToken = decodeUserToken(token);
    if (!userToken) return createNewUser();

    const user = await Users.findOne({
        mailbox: userToken.mailbox
    })
    if (!user) return createNewUser();

    return {
        token: token as string,
        mailBox: user.mailbox as string,
        expiredOn: user.expiredTime,
    }
}

const createNewUser = async (): Promise<User> => {
    const newMailBox = await createNewMailboxAddress();
    const newUser = await Users.create({
        mailbox: newMailBox,
    })

    const token = encodeUserToken({
        mailbox: newUser.mailbox as string,
    })

    return {
        token: token,
        expiredOn: newUser.expiredTime,
        mailBox: newUser.mailbox as string,
    }
}

type UserToken = {
    mailbox: string;
}

const decodeUserToken = (token: string | undefined): UserToken | undefined => {
    if (!token) return undefined;

    try {
        const jwtObj = jwt.verify(token, env.JWT || "") as UserToken;
        return jwtObj
    } catch (_: any) {
        return undefined
    }
}

const encodeUserToken = (user: UserToken): string => {
    return jwt.sign(user, env.JWT || "")
}

const createNewMailboxAddress = async (): Promise<string> => {
    const mbl = env.MAILBOX_DOMAINS.length
    const randIndex = randomBetween(1, mbl) - 1;
    const domain = env.MAILBOX_DOMAINS[randIndex];

    const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'lowerCase'
    });

    const mailboxAddress = `${username}${addAlphaNumeric()}@${domain}`

    const checkExist = await Users.findOne({ mailbox: mailboxAddress });
    if (checkExist) return createNewMailboxAddress() // if this is exist - try again

    return mailboxAddress;
}

function randomBetween(x: number, y: number) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

function addAlphaNumeric(length: number = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let suffix = "";

    for (let i = 0; i < length; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return suffix
}
