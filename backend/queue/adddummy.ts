import { Channel } from "amqplib";
import { env } from "../env";
import { connectAmpq } from "./ampq";

let publishChannel: Channel | null = null;

export const getPublishChannel = async (): Promise<Channel> => {
    if (publishChannel) return publishChannel;
    const connection = await connectAmpq();
    publishChannel = await connection.createChannel();
    await publishChannel.assertQueue(env.RABBITMQ_QUEUE || "recive_mail", { durable: false });
    return publishChannel;
}

export const addDummyMail = async (to: string) => {
    const channel = await getPublishChannel();

    const dummyMail = `uid: 1723707191VlKoL1I2_1
time: 2024-08-15 07:33:11.117449583 +0000 UTC
success: true
cmds: 6/6
tls: true
ptr_ip:
    server_ptr: mx.myworkspacel.ink
    server_ip: 2a01:4f9:c012:5d00::1
    client_ptr: rellit.email
    client_ip: 2a01:4f9:c012:d77b::1
domain: rellit.email
ptr_match: true
spf_fail: false
spf_status: PASS
from: hello@parthka.dev
recipients:
    - ${to}
use_bdat: false
data: |+
    DKIM-Signature: v=1; a=rsa-sha256; c=simple/simple; d=parthka.dev;
    	s=default; t=1723707190;
    	bh=EVfAHeUMDygbJe0SkMWJHjgXGjtiTLZnMQbyWqzsrCY=;
    	h=Date:To:From:Subject;
    	b=elWNDcJ9XMttrWbCwun4GW0WHGgL/L/DH+reRS0PmCFjfyE/vTNiAkx1rZjwRexJ2
    	 ibyb2GY3ShZzrrr8XH0EWa/qZVaQZkXPoZ7ilPtzLYBEs7W1TaXlnrAu/w31RFBnzG
    	 /AHhDSmWKww4ay53BHK1ZI7YKAr8B8ZPI30lNNWKnMc/0aTj0MuS037pAOnPIaNfy6
    	 7Vy1NS4KuOCLHUuutFrSJ9pCb6Xe+KGnhhfZAorHZWlhpRk0CRwJ7S4FrKxoiFuwn+
    	 jlfgum4qlO/i508w+2dAw+7Zsdcev++kcIOI9yk7Z8PuoTmkRTguic0aeKDzFNpq1+
    	 +YRT9rTu6SukQ==
    Received: from [IPV6:2402:a00:162:3778:ed5d:c9bd:60c:6b25] (unknown [IPv6:2402:a00:162:3778:ed5d:c9bd:60c:6b25])
    	by rellit.email (Postfix) with ESMTPSA id 9DEE240CEA
    	for <my@myworkspacel.ink>; Thu, 15 Aug 2024 07:33:10 +0000 (UTC)
    Message-ID: <474f3010-779f-4900-8daf-3dce5cda34ce@parthka.dev>
    Date: Thu, 15 Aug 2024 13:03:07 +0530
    MIME-Version: 1.0
    User-Agent: Mozilla Thunderbird
    Content-Language: en-US
    To: ${to}
    From: Parth <hello@parthka.dev>
    Subject: Hello , From Box!
    Content-Type: text/plain; charset=UTF-8; format=flowed
    Content-Transfer-Encoding: 7bit

    Hello!
`

    channel.sendToQueue(env.RABBITMQ_QUEUE || "recive_mail", Buffer.from(dummyMail))
}