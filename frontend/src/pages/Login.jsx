import Form from "../components/Form"
import "../styles/Login.css"

function Login() {
    return <div>

        <h1 className="title">Tune Critic</h1>
        <Form route="/api/token/" method="login"></Form>
    </div>
}

export default Login