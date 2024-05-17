import React, { useState } from 'react'
import Loading from '../../components/Loading';

import { db, auth } from '../../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';

function Register({ setRegisterOpen }) {
    const [loading, setLoading] = useState(false)

    //Register
    const register = async (name, email, password) => {
        if (name === '') {
            swal('Error!', 'Please enter a name.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                password: password,
            });

            swal('Nice!', 'A user has been created successfully!', 'success');
            setRegisterOpen(false)
        } catch (error) {
            swal('Error!', `Try again: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        register(name,email, password);
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="auth register-overlay">
            <h1 className='text-light'>Sign Up</h1>
            <div className='form-login border-dark border-3 bg-white bg-gradient'>
                <Form style={{ width: '95%' }} onSubmit={handleSubmit}>
                    <Form.Label className='label-login'>
                        Name
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                    />

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
                            Sign Up
                        </Button>
                    </center>
                </Form>
            </div>
            <p className='text-light m-3'>Already have an account?</p>
            <Button onClick={() => { setRegisterOpen(false) }}
                variant="danger" className='button-submit' style={{ backgroundColor: '#D22E1E' }}>
                Login
            </Button>
        </div>
    );
}

export default Register;