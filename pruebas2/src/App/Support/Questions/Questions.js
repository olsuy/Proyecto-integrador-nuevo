import { useEffect, useRef } from "react";

import Question from "../Question/Question";
import "./Questions.css";


function FAQ(){

    const faqRef = useRef();


    useEffect(()=>{

        const observer = new IntersectionObserver(

            ([entry])=>{

                if(entry.isIntersecting){

                    faqRef.current.classList.add("show");

                }

            },

            {
                threshold:0.2
            }

        );


        if(faqRef.current){

            observer.observe(faqRef.current);

        }


        return ()=>{

            if(faqRef.current){

                observer.unobserve(faqRef.current);

            }

        };


    },[]);



    return(

        <div 
            className="faq scroll_animation"
            ref={faqRef}
        >

            <h2 className="Titulo_questions">
                Frequently Asked Questions
            </h2>


            <Question

                question="How do I connect a new PLC to the system?"

                answer="To connect a new PLC, configure the communication parameters, select the appropriate protocol, and register the device in the monitoring system."

            />


            <Question

                question="What should I do if data is not updating?"

                answer="Check that the equipment is powered on, verify the network connection, and confirm that the PLC communication settings are correctly configured."

            />


            <Question

                question="How can I reset my account password?"

                answer="Use the password recovery option on the login page and follow the instructions sent to your registered email address."

            />


            <Question

                question="How can I configure alerts and notifications?"

                answer="Configure alarms from the system settings by selecting the conditions, devices, and notification methods required for your operation."

            />


        </div>

    );

}


export default FAQ;