import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import { useNavigate } from 'react-router-dom';

function Header() {
    // const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('Sign out successful');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home" className="fs-3">Finally</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link className='fs-5 mx-4' href="#home">Home</Nav.Link>
                        <Nav.Link className='fs-5 mx-4' href="#link">Link</Nav.Link>
                        <Nav.Link className='fs-5 mx-4' href="#link">About</Nav.Link>
                        <Nav.Link className='fs-5 mx-4' href="#link">Contact</Nav.Link>
                        <Nav.Link className='fs-5 mx-4' href="#link">Serices</Nav.Link>
                        <Nav.Link className='fs-5 mx-4' href="#link">Footer</Nav.Link>
                        <Nav.Link className='fs-5 mx-4' href="#link"><button onClick={handleSignOut}>Sign Out</button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;