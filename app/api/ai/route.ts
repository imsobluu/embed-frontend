import { NextResponse } from "next/server";
import OpenAi from "openai";

const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });


export async function POST(request: Request) {
    const { language, text } = await request.json();
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0301',
        messages: [
            {
                role: "system", content: `You will be provided with an audio file in ${language}.\
                your taks is to detect the word from audio file ,mainly find for command\
                -"Alert ON"  \
                `},
            { role: "user", content: text },
        ],
        temperature: 0,
        max_tokens: 60,
        top_p: 1,
    });

    return NextResponse.json({
        text: response.choices[0].message.content,
    })
}
