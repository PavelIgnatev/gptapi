const express = require("express");
const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 8080;

app.use(express.json());

app.use((req, res, next) => {
  req.id = uuidv4();
  req.timestamp = new Date().toISOString();
  next();
});

const tokens = [
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
];

function* apiKeysGenerator(tokens) {
  let index = 0;

  while (true) {
    yield tokens[index];
    index = (index + 1) % tokens.length;
  }
}
let generator = apiKeysGenerator(tokens);

const checkValidateDialog = (dialogue) =>
  !dialogue ||
  !Array.isArray(dialogue) ||
  !dialogue.every(
    (d) =>
      ["system", "assistant", "user", "function"].includes(d.role) && d.content
  );

async function processChatRequest(req, res) {
  const token = generator.next().value;

  try {
    const { dialogue } = req.body;

    if (checkValidateDialog(dialogue)) {
      return res
        .status(400)
        .send(
          "Invalid data format. Please check if it conforms to Array<{role: 'system' | 'assistant' | 'user' | 'function'; content: string}>"
        );
    }

    if (!token) {
      throw new Error("Token not defined");
    }

    console.log(
      `[${req.timestamp}] Request ID ${req.id}: Current token in processing: ${token}`
    );

    console.log(
      `[${req.timestamp}] Request ID ${
        req.id
      }: Dialogue information for the request: ${JSON.stringify(dialogue)}`
    );

    const openai = new OpenAI({
      apiKey: token,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: dialogue,
      model: "gpt-3.5-turbo",
    });

    const { content } = chatCompletion.choices[0].message;
    if (!content) {
      throw new Error("Result not found");
    }

    console.log(
      `[${req.timestamp}] Request ID ${req.id}: Dialog result: ${content}`
    );
    return res.send(content);
  } catch (error) {
    try {
      const { message } = error;
      const errorMessage = message?.toLowerCase();
      console.error(
        `[${req.timestamp}] Request ID ${req.id}: Error: ${errorMessage}`
      );

      try {
        if (
          errorMessage?.includes("rate limit") ||
          errorMessage?.includes("result not found")
        ) {
          console.error(
            `[${req.timestamp}] Request ID ${req.id}: Error: Rate Limit/Result not found`
          );
          throw new Error("Rate Limit/Result not found");
        }

        const tokenIndex = tokens.findIndex((tk) => tk === token);
        if (tokenIndex !== -1) {
          delete tokens[tokenIndex];
          generator = apiKeysGenerator(tokens);

          console.error(
            `[${req.timestamp}] Request ID ${req.id}: Token found, deleting from tokens`
          );
        } else {
          console.error(
            `[${req.timestamp}] Request ID ${req.id}: Error: Token not found, no removal`
          );
        }

        console.error(
          `[${req.timestamp}] Request ID ${req.id}: Error that led to token removal`
        );
        throw new Error("Error that led to token removal");
      } catch {
        console.error(`[${req.timestamp}] Request ID ${req.id}: Error, RETRY`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await processChatRequest(req, res);
      }
    } catch {
      console.error(
        `[${req.timestamp}] Request ID ${req.id}: Error: Unexpected error`
      );
      return res.status(500).send("Unexpected error");
    }
  }
}

app.post("/chat", async (req, res) => {
  await processChatRequest(req, res);
});

app.get("/chat/count", async (req, res) => {
  return res.status(200).send(String(tokens.length));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
