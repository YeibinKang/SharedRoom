import Navbar from "../components/navbar"
import Footer from "../components/footer"
import SideMenu from "../components/SideMenu"

// user should be logged in
//if matched: return SideMenu with user'id
//else: return 'user not authenticated' message
export default function MyPage() {

    var cookieString = document.cookie;
    var currentId = cookieString.split('=')[0];

    //todo: if condition is inappropriate for checking..
    if (currentId != '') {
        //fetch 

        return (
            <div>
                <Navbar></Navbar>
                <SideMenu></SideMenu>
                <Footer></Footer>
            </div>


        )

    } else {
        return (
            <div>
                <Navbar></Navbar>
                <h1>User is not authenticated</h1>
                <Footer></Footer>
            </div>


        )
    }


}