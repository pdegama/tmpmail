import { Context } from "hono";
import jwt from "jsonwebtoken"
import { env } from "../env";
import { Users } from "../models/users";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const getMailBoxUser = async (c: Context): Promise<User> => {
    // @ts-ignore
    const authToken = c.req.header('Authorization')?.split(" ")[1];
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

    const user = await userExist(userToken);
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

export const decodeUserToken = (token: string | undefined): UserToken | undefined => {
    if (!token) return undefined;

    try {
        const jwtObj = jwt.verify(token, env.JWT || "") as UserToken;
        return jwtObj
    } catch (_: any) {
        return undefined
    }
}

export const encodeUserToken = (user: UserToken): string => {
    return jwt.sign(user, env.JWT || "")
}

export const createNewMailboxAddress = async (): Promise<string> => {
    const mbl = env.MAILBOX_DOMAINS.length
    const randIndex = randomBetween(1, mbl) - 1;
    const domain = env.MAILBOX_DOMAINS[randIndex];

    const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'lowerCase'
    });

    const mailboxAddress = `${username}${addAlphaNumeric()}@${domain}`.toLowerCase()

    const checkExist = await mailboxExist(mailboxAddress);
    if (checkExist) return createNewMailboxAddress();

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

export async function changeMailbox(user: UserToken, mailbox: string) {
    const change = await Users.updateOne({ mailbox: user.mailbox }, { mailbox: mailbox });
    if (!change.modifiedCount) throw "Failed to change mailbox";
}

export async function mailboxExist(mailbox: string): Promise<boolean> {
    const existMailBox = await Users.findOne({ mailbox: mailbox.trim().toLowerCase() });
    return !!existMailBox;
}

export function validMailbox(mailbox: string): string {
    const mailRegEx = /(.+)@(.+)/;
    if (!mailRegEx.test(mailbox.trim())) throw "Invalid mailbox";
    const [_, domain] = mailbox.trim().split("@");
    if (!env.MAILBOX_DOMAINS.includes(domain.toLowerCase())) throw "Invalid Domain name";
    return mailbox.trim().toLowerCase();
}

export async function userExist(userToken: UserToken) {
    const user = await Users.findOne({ mailbox: userToken.mailbox.trim().toLowerCase() });
    return user;
}

export async function verifyUser(c: Context) {
    const userToken = decodeUserToken(c.req.header('Authorization')?.split(" ")[1]);
    if (!userToken) throw "Invalid request, maybe invalid token";
    const user = await userExist(userToken);
    if (!user) throw "User not found";
    return userToken;
}