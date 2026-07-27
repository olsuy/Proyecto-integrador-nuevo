import "./Support_Section.css";

import Questions from "../Questions/Questions";
import Panel_info from "../Panel_info/Panel_info";


function Support_Section() {

    return (

        <section className="support_section">

            <div className="support_questions">

                <Questions />

            </div>


            <div className="support_contact">

                <Panel_info />

            </div>

        </section>

    );

}


export default Support_Section;