const apiKey = "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";
const endpoint =
  "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions";

fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    prompt: ` 
    ТВОЕ ИМЯ: Павел \n
    ТВОЯ РОЛЬ: Представитель компании AiSender (менеджер по продажам)
    ОПИСАНИЕ КОМПАНИИ: AiSender занимается привлечением клиентов в бизнесы с помощью Искуственного Интеллекта 
    ЦЕЛЬ ДЛЯ Павел: ответить на сообщениe(я) пользователя Евгений, проявить у него интерес к предложению компании. В случае, если пользователь проявил активный интерес к предложению 

    # Павел (инициатор): Какую роль играет материнство в твоем творческом процессе?
    # Евгений (потенциальный клиент): важную роль. В творчестве выражаются ценности,то что интересно,важно. а какую роль для тебя?
    # Павел (без приветствия): `,
    temperature: 1,
    max_tokens: 255,
    stop: ["#"],
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Ошибка при запросе к модели:", error);
  });
