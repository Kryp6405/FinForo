import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import './Comment.css'

import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import swal from 'sweetalert';
import { Modal, Button, Form } from 'react-bootstrap';

function Comment({ setOpenComment, user, selectedPost }) {
    const [loading, setLoading] = useState(false);

    const handleSubmitComment = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const description = form.elements.description.value;
        makeComment(description);
    }

    const makeComment = async (description) => {
        setLoading(true);
        const prevComments = selectedPost.comments
        prevComments.push({
            user: user,
            description: description,
            date: new Date(),
        })
        try {
            await updateDoc(doc(db, 'posts', selectedPost.id), {
                comments: prevComments,
            });

            swal('Nice!', 'A comment has been created successfully!', 'success');
            setOpenComment(false)
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
                    <div className='comment-modal-container'>
                        <div className='comment-modal-header'>
                            <div>
                                <img src={require('../../utils/img/user.png')} />
                                <h2>Oliver Garcia</h2>
                            </div>

                            <div>
                                <Button variant="danger" onClick={() => { setOpenComment(false) }}>
                                    Close
                                </Button>
                            </div>
                        </div>

                        <div className='comment-modal-post'>
                            <Form className="comment-modal-description" onSubmit={handleSubmitComment}>
                                <Form.Control
                                    className="comment-modal-description-text"
                                    as="textarea"
                                    name="description"
                                    placeholder="Post reply here..."
                                    required
                                />
                                <Button variant="danger" className="comment-modal-reply" type="submit">
                                    Reply
                                </Button>

                            </Form>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>


        </>
    );
}

export default Comment;
