import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Header from "./components/Header";
import Footer from './components/Footer';

function App() {  
  return (
    <>
      <Header/>
      <main className="py-5">
        <Container>
          <Outlet/> 
        </Container>
        <Footer/>
        <ToastContainer/>
      </main>
    </>
  );
} 

export default App;

//https://github.com/bradtraversy/proshop-v2
