const args = process.argv.slice(2);

const command = args[0];
const options = args.slice(1);

const colors = {
    green: (str: string) => `\x1b[32m${str}\x1b[0m`,
    blue: (str: string) => `\x1b[34m${str}\x1b[0m`
}

async function main() {
    switch (command) {
        case "s":
        case "short":
            const url = options[0];

            if (!url)
                throw new Error("No URL provided");


            console.log(`[${colors["green"]('shorten')}] Shortening URL: ${colors["blue"](options[0])} ${(options[1] != null ? `with alias "${colors["blue"](options[1])}"` : '')}`)

            const x = await fetch(`https://u.tiramify.dev/s?u=${encodeURIComponent(url)}${options[1] != null ? `&a=${encodeURIComponent(options[1])}` : ''}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const j: any = await x.json();

            if (!j?.success)
                throw new Error(j.message);

            if (!j?.data?.url)
                throw new Error("No URL returned");

            console.log(`[${colors["green"]('shorten')}] Result: ${colors["blue"](j?.data?.url)}`);
            break;
        case "g":
        case "r":
        case "retrieve":
        case "get":
            const codeOrShortUrl = options[0];

            console.log(`[${colors["green"]('retrieve')}] Retrieving URL: ${colors["blue"](codeOrShortUrl)}`);

            if (!codeOrShortUrl)
                throw new Error("No code or short URL provided");

            const r = await fetch('https://u.tiramify.dev/g?u=' + encodeURIComponent(codeOrShortUrl), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json: any = await r.json();

            if (!json?.success)
                if (json?.message == "Nothing found")
                    return console.log(`[${colors["green"]('shorten')}] No URL found with that code or short URL`);
                else
                    throw new Error(json?.message);

            console.log(`[${colors["green"]('shorten')}] Result: ${colors["blue"](json?.data?.url)}`);
            break;
        default:
            throw new Error("Invalid command, available commands: s, short, g, r, retrieve, get");
    }
}

main().catch(e => console.error(e));