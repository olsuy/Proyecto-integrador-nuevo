import "./Support.css";
import Support_home from "./Home/Support_home"
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import Support_Section from "../Support/Seccion/Support__Section";
import Article from "../Support/Article/Article"
function Support(){
    return(
        <section className="Support">
        <Nav />
        <Support_home />
       <Support_Section/>
       <Article/>
        <Footer/>

        </section>
       
    );
}
export default Support;
