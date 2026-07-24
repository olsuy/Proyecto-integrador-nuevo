import "./Cards.css";

function Card({ icon, title, description, value, color }) {

    return (

        <div className="card">

            <div className="card_header">

                <img
                    src={icon}
                    alt={title}
                    className="cardicon"
                />

                <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>

            </div>

            <h2 style={{ color }}>
                {value}
            </h2>

        </div>

    );

}

export default Card;