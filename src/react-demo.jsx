import React, { Component } from "react";
import { createRoot } from "react-dom/client";

const userName = "React Developer";
const today = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());

function Greeting({ name }) {
    return <p className="greeting">Hello, {name}!</p>;
}

class WelcomeMessage extends Component {
    render() {
        return (
            <p className="welcome-message" style={{ color: "#0e7490" }}>
                React is awesome!
            </p>
        );
    }
}

function App() {
    const plainHtml = React.createElement(
        "section",
        { className: "output-block" },
        React.createElement("h3", null, "Hello from React!"),
        React.createElement("p", null, `Today is ${today}`)
    );

    return (
        <main className="page-shell">
            <header className="hero">
                <a className="back-link" href="/">Express learning lab</a>
                <span className="eyebrow">ReactJS · Experiment 01</span>
                <h1>React Building Blocks</h1>
                <p>From rendered elements to JSX and reusable, nested components.</p>
                <div className="hero-tags">
                    <span>React 19</span>
                    <span>JSX</span>
                    <span>Props</span>
                    <span>Components</span>
                </div>
            </header>

            <section className="lesson-card">
                <div className="section-heading">
                    <span className="step">01</span>
                    <div>
                        <h2>Render without JSX</h2>
                        <p>Build elements with React.createElement.</p>
                    </div>
                </div>
                {plainHtml}
                <pre><code>{'React.createElement("h1", null, "Hello from React!")'}</code></pre>
            </section>

            <section className="lesson-card">
                <div className="section-heading">
                    <span className="step">02</span>
                    <div>
                        <h2>Markup with JSX</h2>
                        <p>Expressions, className attributes, and inline styles.</p>
                    </div>
                </div>
                <div className="output-block jsx-output">
                    <h3>Hello from React!</h3>
                    <p>Today is {today}</p>
                    <p>2 + 2 = {2 + 2}</p>
                    <p className="expression-result">Welcome, {userName}!</p>
                    <span className="style-chip" style={{ backgroundColor: "#dff5ed" }}>
                        Inline-styled JSX
                    </span>
                </div>
            </section>

            <section className="lesson-card">
                <div className="section-heading">
                    <span className="step">03</span>
                    <div>
                        <h2>Function &amp; class components</h2>
                        <p>Reusable components composed together inside App.</p>
                    </div>
                </div>
                <div className="component-output">
                    <div>
                        <span className="component-type">FUNCTION · PROPS</span>
                        <Greeting name="Alice" />
                    </div>
                    <div className="component-divider"></div>
                    <div>
                        <span className="component-type">CLASS · NESTED</span>
                        <WelcomeMessage />
                    </div>
                </div>
                <pre><code>{'<Greeting name="Alice" />  +  <WelcomeMessage />'}</code></pre>
            </section>

            <footer>
                <span>Rendered with React.createRoot</span>
                <span>One App · three React fundamentals</span>
            </footer>
        </main>
    );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error('React root element "#root" was not found.');
}

createRoot(rootElement).render(<App />);
