import Navbar from "../components/navbar"
import footer from "../components/footer"
import SideMenu from "../components/SideMenu"

//todo: user should be logged in
export default function MyPage(){
    return(
        <div>
            <Navbar></Navbar>
            <SideMenu></SideMenu>
            <footer></footer>
        </div>
        

    )
}