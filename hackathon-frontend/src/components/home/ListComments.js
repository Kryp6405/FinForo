import React, { useEffect, useState } from "react";
import './ListComments.css'
import { Button, Form } from 'react-bootstrap';

function ListComments({ comments }) {
    return (
        <>
            {comments.map((comment, index) => (
                <div key={index} className='comment-container'>
                    <hr />
                    <div className='comment-header'>
                        <img src={require('../../utils/img/user.png')} />
                        <h2>{comment.user}</h2>
                    </div>

                    <Form.Control
                        className="comment-description-text"
                        as="textarea"
                        placeholder={comment.description}
                        disabled
                    />
                </div>

            ))}
        </>

    );
}

export default ListComments;
