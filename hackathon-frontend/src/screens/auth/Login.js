import React, { useState } from 'react';
import './Auth.css'

import Loading from '../../components/Loading';
import Register from './Register.js';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

import { Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';

function Login() {
    const [loading, setLoading] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(true);

    //Login
    const login = async (email, password) => {
        try {
            setLoading(true);
            const user = await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            swal('Error', 'Error, please try again.', 'error');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        login(email, password);
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="auth">
                <h1 className='text-light'>Log In</h1>
                <div className='form-login border-dark border-3 bg-white bg-gradient'>
                    <Form style={{ width: '95%' }} onSubmit={handleSubmit}>
                        <Form.Label className='label-login'>
                            Email
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        />

                        <Form.Label className='label-login'>
                            Password
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            minLength={8}
                        />
                        <center>
                            <Button variant="danger" className='button-submit' style={{ backgroundColor: '#D22E1E' }} type="submit">
                                Sign In
                            </Button>
                        </center>
                    </Form>
                </div>
                <p className='text-light m-3'>Do not have an account?</p>
                <Button onClick={() => {setRegisterOpen(true)}}
                 variant="danger" className='button-submit' style={{ backgroundColor: '#D22E1E' }}>
                    Register
                </Button>
            </div>

            {registerOpen && <Register setRegisterOpen={setRegisterOpen}/>}
        </>
    );
}

export default Login;