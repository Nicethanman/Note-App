import Form from "../components/Form"
import "../styles/Login.css"

function Login() {
    return <div>

        <h1 className="title">Tune Critique</h1>
        <img src="../imgs/cat.png" alt="not working"></img>
        <Form route="/api/token/" method="login"></Form>
    </div>
}

export default Login