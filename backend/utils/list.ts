import mongoose from "mongoose";
import { Mails, MailType } from "../models/mails";
import { UserType } from "../models/users";

export async function getTotalMailCount(user: UserType): Promise<number> {
    const totalEmails = await Mails.countDocuments({
        userId: user?._id,
        deleted: {
            $ne: true,
        },
    })
    return totalEmails
}

export async function getMails(user: UserType, props: {
    after: string | mongoose.ObjectId | null,
    limit: number,
}): Promise<MailType[]> {
    const mails = await Mails.find({
        userId: user?._id,
        deleted: {
            $ne: true,
        },
        ...(props.after ? { _id: { $lt: props.after } } : {}),
    })
        .sort({ _id: -1 })
        .limit(props.limit)
        .select("-__v")
    return mails
}

export async function getAfterId(mails: MailType[]): Promise<string | mongoose.ObjectId | any> {
    if (mails.length === 0) return undefined
    return mails[mails.length - 1]?._id
}