import { Mails } from "../models/mails";
import { UserType } from "../models/users";

export async function readMail(user: UserType, mailId: object | string, read: boolean = true): Promise<void> {
    try {
        await Mails.updateOne({
            userId: user._id,
            _id: mailId,
        }, {
            read: read
        })
    } catch (err) {
        throw "Failed to update mail";
    }
}

export async function unreadMail(user: UserType, mailId: object | string): Promise<void> {
    await readMail(user, mailId, false)
}

export async function deleteMail(user: UserType, mailId: object | string): Promise<void> {
    try {
        await Mails.updateOne({
            userId: user._id,
            _id: mailId,
        }, {
            deleted: true
        })
    } catch (err) {
        throw "Failed to delete mail";
    }
}