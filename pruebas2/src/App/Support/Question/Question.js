import { useState } from "react";
import "./Question.css";

function Question({ question, answer }) {

    const [open, setOpen] = useState(false);

    return (

        <div className={`question ${open ? "active" : ""}`}>

            <button
                className="question_header"
                onClick={() => setOpen(!open)}
            >

                <span>{question}</span>

                <span className={`arrow ${open ? "rotate" : ""}`}>
                    ▼
                </span>

            </button>

            {open && (

                <div className="question_answer">

                    <p>{answer}</p>

                </div>

            )}

        </div>

    );

}

export default Question;