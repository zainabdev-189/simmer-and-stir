import React from "react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function Main() {

    const [ingredients, setIngredients] = React.useState([])
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState("")

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        const newItem = { id: crypto.randomUUID(), name: newIngredient }
        setIngredients(prevIngredients => [...prevIngredients, newItem])
    }

    function deleteIngredient(id) {
        setIngredients(prevIngredients => prevIngredients.filter(item => item.id !== id))
    }

    function startEditing(item) {
        setEditingId(item.id)
        setEditValue(item.name)
    }

    function cancelEditing() {
        setEditingId(null)
        setEditValue("")
    }

    function saveEdit(id) {
        setIngredients(prevIngredients =>
            prevIngredients.map(item =>
                item.id === id ? { ...item, name: editValue } : item
            )
        )
        setEditingId(null)
        setEditValue("")
    }

    const ingredientsListItems = ingredients.map(item => (
        <li key={item.id}>
            { editingId === item.id ? (
                <>
                    <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        aria-label="Edit ingredient"
                    />
                    <button onClick={() => saveEdit(item.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                </>
            ) : (
                <>
                    {item.name}
                    <button onClick={() => startEditing(item)} aria-label="Edit ingredient" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                    </button>
                    <button onClick={() => deleteIngredient(item.id)} aria-label="Delete ingredient" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                        </svg>
                    </button>
                </>
            )}
        </li>
    ))
    const [isShown, setIsShown] = useState(false)
    const [recipe, setRecipe] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    async function getRecipe() {
        setIsShown(true)
        setIsLoading(true)
        setError("")
        setRecipe("")

        try {
            const response = await fetch("/api/recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients: ingredients.map(item => item.name) })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            setRecipe(data.recipe)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            <form action={addIngredient} className="addIngredient">
                <input
                    type="text"
                    placeholder="e.g. flour"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            { ingredientsListItems.length >= 1 && 
            <section className="list">
                <h2 style={{color: "black", fontSize: "x-large"}}>Ingredients on hand:</h2>
                <ul className="ingredientList" aria-live="polite">{ingredientsListItems}</ul>
            </section>
            }

            { ingredientsListItems.length >= 4 && 
                 <div className="get-recipe-container">
                    <div>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>
            }

            { isShown &&
                <section className="recipe-output">
                    { isLoading && <p>Generating your recipe...</p> }
                    { error && <p style={{color: "red"}}>{error}</p> }
                    { recipe && <ReactMarkdown>{recipe}</ReactMarkdown> }
                </section>
            }
         </main>
    

    )
}

 
