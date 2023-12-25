const express = require("express");
const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");

const app = express();
const port = 80;

app.use(express.json());

app.use((req, res, next) => {
  req.id = uuidv4();
  req.timestamp = new Date().toISOString();
  next();
});

const key = "mysecretkey12345";
const tokens = decryptArray(
  "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",
  key
);

function decryptArray(encrypted, key) {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
    CryptoJS.enc.Utf8
  );
  return JSON.parse(decrypted);
}

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
    const { dialogue, temperature = 1 } = req.body;

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

    const data = {
      messages: dialogue,
      model: "gpt-3.5-turbo",
    };

    if (temperature !== 1) {
      console.log(
        `[${req.timestamp}] Request ID ${req.id}: Change default temperature: ${temperature}`
      );

      data["temperature"] = temperature;
    }

    const chatPromise = openai.chat.completions.create(data);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 60000)
    );
    const chatCompletion = await Promise.race([chatPromise, timeoutPromise]);

    if (
      !chatCompletion ||
      !chatCompletion.choices ||
      !chatCompletion.choices[0] ||
      !chatCompletion.choices[0].message ||
      !chatCompletion.choices[0].message.content
    ) {
      throw new Error("Result not found");
    }
    const { content } = chatCompletion.choices[0].message;

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
          tokens.splice(tokenIndex, 1);
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

async function processCompleteRequest(req, res) {
  const token = generator.next().value;
  try {
    const { prompt } = req.body;

    if (!token) {
      throw new Error("API key not defined");
    }

    console.log(
      `[${req.timestamp}] Request ID ${req.id}: Current API key in processing: ${token}`
    );

    console.log(
      `[${req.timestamp}] Request ID ${
        req.id
      }: Dialogue information for the request: ${JSON.stringify(prompt)}`
    );

    const data = {
      prompt,
      temperature: 1,
      max_tokens: 255,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 1,
    };

    const response = await fetch(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    if (
      !responseData ||
      !responseData.usage ||
      !responseData.usage.completion_tokens ||
      !responseData.choices ||
      !responseData.choices[0] ||
      !responseData.choices[0].text
    ) {
      throw new Error("Result not found");
    }

    const content = responseData.choices[0].text.replace(/\n/g, "").trim();
    const tokens = responseData.usage.completion_tokens;

    if (!content) {
      throw new Error("Result not found");
    }

    if (Number(tokens) === 255 || tokens === "255") {
      throw new Error("Max tokens usage");
    }

    console.log(
      `[${req.timestamp}] Request ID ${req.id}: Dialog result: ${content}`
    );

    return res.send(content);
  } catch (error) {
    console.error(
      `[${req.timestamp}] Request ID ${req.id}: Error: ${error.message}`
    );
    return res.status(500).send("Unexpected error");
  }
}

app.post("/chat", async (req, res) => {
  await processChatRequest(req, res);
});

app.post("/complete", async (req, res) => {
  await processCompleteRequest(req, res);
});

app.get("/chat/count", async (req, res) => {
  return res.status(200).send(String(tokens.length));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
