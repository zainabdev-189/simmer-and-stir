import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user
has and suggests a recipe they could make with some or all of those
ingredients. You don't need to use every ingredient they mention in
your recipe. The recipe can include additional ingredients they didn't
mention, but try not to include too many extra ingredients. Format your
response in markdown to make it easier to render to a web page
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'ingredients array is required' });
  }

  const ingredientsString = ingredients.join(', ');

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      `I have ${ingredientsString}. Please give me a recipe.`
    );

    return res.status(200).json({
      recipe: result.response.text()
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to generate recipe' });
  }
}
