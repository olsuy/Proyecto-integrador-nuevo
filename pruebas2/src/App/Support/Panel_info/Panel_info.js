import { useEffect, useRef } from "react";

import "./Panel_info.css";

import Contact_info from "../Contact_info/Contact_info";

import {
    Mail,
    Phone,
    Clock3,
    MapPin
} from "lucide-react";


function Panel_info() {


    const panelRef = useRef();



    useEffect(()=>{


        const observer = new IntersectionObserver(

            ([entry])=>{

                if(entry.isIntersecting){

                    panelRef.current.classList.add("show");

                }

            },

            {
                threshold:0.2
            }

        );


        if(panelRef.current){

            observer.observe(panelRef.current);

        }


        return ()=>{

            if(panelRef.current){

                observer.unobserve(panelRef.current);

            }

        };


    },[]);



    return (

        <div 
            className="contact_info scroll_animation"
            id="contact-info"
            ref={panelRef}
        >

            <h2>
                Contact Information
            </h2>


            <Contact_info
                icon={<Mail size={18} />}
                title="Email"
                value="support@industrialretono.com"
            />


            <Contact_info
                icon={<Phone size={18} />}
                title="Phone"
                value="+52 33 1234 5678"
            />


            <Contact_info
                icon={<Clock3 size={18} />}
                title="Service Hours"
                value="Mon - Fri: 8:00 AM - 6:00 PM (CST)"
            />


            <Contact_info
                icon={<MapPin size={18} />}
                title="Location"
                value="Industrial del Retoño, El LLano, Aguascalientes, México"
            />


        </div>

    );

}


export default Panel_info;