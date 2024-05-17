import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Post.css'
import Loading from "../Loading";

import { db } from "../../firebase";
import { collection, addDoc } from 'firebase/firestore';

import swal from 'sweetalert';
import { Form, Button, Modal } from 'react-bootstrap';

function MakeComment({ setModalMakeComment, user, data }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const handleSubmitPost = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const title = form.elements.title.value;
        const description = form.elements.description.value;
        makePost(title, description);
    }

    const makePost = async (title, description) => {
        setLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                user: user,
                title: title,
                description: description,
                comments: [],
                date: new Date(),
                simulation: data,
            });

            swal('Nice!', 'A post has been created successfully!', 'success');
            navigate('/');
        } catch (error) {
            swal('Error!', `Try again: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <Modal size='lg' show={true} >
                <Modal.Body style={{ width: '100%' }}>
                    <div className='modal-container'>
                        <div className="modal-header">
                            <h1>Make a Post</h1>

                            <Button variant="danger" onClick={() => { setModalMakeComment(false) }}>
                                Close
                            </Button>
                        </div>

                            <Form className="modal-form" onSubmit={handleSubmitPost}>
                                <h2>Title</h2>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    maxLength={30}
                                    required
                                />

                                <h2>Description</h2>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    required
                                />

                                <center>
                                <Button variant="danger" className="modal-button" type="submit">
                                    Submit
                                </Button>
                                </center>
                            </Form>

                    </div>

                </Modal.Body>
            </Modal>


        </>
    );
}

export default MakeComment;
