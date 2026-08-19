import React, { useEffect, useState } from 'react';
import '../landing.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import WestCo from './assets/westco.jpg';
import LandingSearchComp from './components/landing/LandingSearchComp';
import axiosClient from './lib/axios';

const BASE_URL = 'https://coursesnodejs.herokuapp.com/';

const token = localStorage.getItem('isAdminAuthenticated');

const LandingPage = () => {
  const [search, setSearch] = useState('');
  const [tutor, setTutor] = useState([]);
  const [book, setBook] = useState([]);
  const [searched, setSearched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShow, setIsshow] = useState(false);
  const [productSelected, setProductSelected] = useState([]);

  useEffect(() => {
    getTutors();
    getBooks();
  }, []);

  const getTutors = () => {
    axiosClient({
      url: `${BASE_URL}employee/course?limit=10&page=1`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setTutor(res.data.data.data);
      setLoading(false);
    });
  };

  const getBooks = () => {
    axiosClient({
      method: 'get',
      url: `${BASE_URL}employee/book?limit=10000&page=1`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setBook(res.data.data.data);
    });
  };

  const getProductSelected = (id) => {
    const selectedBook = book.filter((item) => item._id === id);
    const courseSelected = tutor.filter((item) => item._id === id);
    if (selectedBook) {
      setProductSelected(selectedBook);
    } else {
      setProductSelected(courseSelected);
    }
  };

  const isAdmin = localStorage.getItem('userToken');
  const adminExist = localStorage.getItem('isAdminAuthenticated');

  // functions
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = () => {
    searchBook(search);
  };

  const searchBook = (str) => {
    const filteredTutor = tutor.filter((item) => item.name.toLowerCase() === str.toLowerCase());

    const filteredBook = book.filter((item) => item.name.toLowerCase() === str.toLowerCase());

    const checkIfExist = (books, tutors) => {
      if (books.length === 0) {
        return tutors;
      } else {
        return books;
      }
    };
    setSearched(checkIfExist(filteredBook, filteredTutor));
    setIsshow(true);
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">
            <Link className="text-decoration-none" to="/">
              <img src={WestCo} style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 py-0 my-lg-0">
              <Nav.Link href="#action1">
                <Link className="text-decoration-none" to="/">
                  Home
                </Link>
              </Nav.Link>
              <NavDropdown className="py-0" title="Authorization" id="navbarScrollingDropdown">
                <NavDropdown.Item className="px-0 py-0">
                  <Link className="h3 text-decoration-none w-100 p-2 my-0 text-center d-block" to="/login">
                    Login
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider className="my-0" />
                <NavDropdown.Item className="px-0 py-0">
                  {isAdmin || adminExist ? (
                    <Link
                      className="h3 text-decoration-none w-100 p-2 my-0 text-center d-block"
                      to={adminExist ? '/admin' : '/user'}
                    >
                      Profil
                    </Link>
                  ) : (
                    <Link className="h3 text-decoration-none w-100 p-2" to="/signup">
                      Sign Up
                    </Link>
                  )}
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex align-items-center">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={handleChange}
              />
              <Button type="primary" onClick={handleSubmit}>
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LandingSearchComp
        handler={getProductSelected}
        selectedProduct={productSelected}
        setler={setIsshow}
        isShow={isShow}
        data={searched}
      />
    </>
  );
};

export default LandingPage;
