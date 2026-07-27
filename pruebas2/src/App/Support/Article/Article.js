import { useEffect, useRef } from "react";
import "./Article.css";


function Article(){

    const articleRef = useRef();


    useEffect(()=>{

        const observer = new IntersectionObserver(

            ([entry])=>{

                if(entry.isIntersecting){

                    articleRef.current.classList.add("show");

                }

            },

            {
                threshold:0.2
            }

        );


        if(articleRef.current){

            observer.observe(articleRef.current);

        }


        return ()=>{

            if(articleRef.current){

                observer.unobserve(articleRef.current);

            }

        };


    },[]);



    return(

        <section 
            className="article scroll_animation"
            ref={articleRef}
        >

            <div className="article_content">


                <h2>
                    Still need help?
                </h2>


                <p>
                    Our technical team is ready to assist
                    you with your industrial solutions.
                </p>


                <a 
                    href="#contact-info"
                    className="article_button"
                >
                    Contact our team
                </a>


            </div>


        </section>

    );

}


export default Article;