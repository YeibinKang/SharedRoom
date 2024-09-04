import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import Calendar from "../components/calendar.jsx";


export default function Home(){
    return(
        <div>
            <Navbar />
            <Calendar></Calendar>
            <Footer />
        </div>
        
    );
}