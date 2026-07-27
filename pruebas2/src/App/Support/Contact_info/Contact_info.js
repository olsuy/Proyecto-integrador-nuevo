import "../Contact_info/Contact_info.css";

function Contact_info(props) {

    return (

        <div className="contact_item">

            <div className="contact_icon">
                {props.icon}
            </div>

            <div className="contact_text">

                <span className="contact_title">
                    {props.title}
                </span>

                <span className="contact_value">
                    {props.value}
                </span>

            </div>

        </div>

    );

}

export default Contact_info;