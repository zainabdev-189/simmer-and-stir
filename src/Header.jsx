import "./App.css"
import img from "./assets/stir.png"

function Header(){
    return (
    <header>
        <div className="head">
            <img src={img} alt="chef image" className="img"/>
            <h2 className="name">Simmer & Stir</h2>
        </div>
    </header>
)}
export default Header