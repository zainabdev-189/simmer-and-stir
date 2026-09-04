import { HfInference } from '@huggingface/inference';

const hf = new HfInference("PASTE_YOUR_TOKEN_HERE");

try {
  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages: [
      { role: "user", content: "Say hello in one sentence." }
    ],
    max_tokens: 100,
  });

  console.log("SUCCESS:");
  console.log(response.choices[0].message.content);
} catch (err) {
  console.log("FAILED WITH:");
  console.log(err);
}