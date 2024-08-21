import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import RoomCollection from "../components/roomCollection.jsx";


export default function Home(){
    return(
        <div>
            <Navbar />
            <RoomCollection></RoomCollection>
            <Footer />
        </div>
        
    );
}