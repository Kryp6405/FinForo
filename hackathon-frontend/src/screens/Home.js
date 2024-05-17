import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import Loading from "../components/Loading";
import SvgHome from "../components/home/SvgHome";
import Comment from "../components/home/Comment";
import ListComments from "../components/home/ListComments";
import Chart from "../components/home/Chart";

import { db, auth } from "../firebase";
import { collection, query, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";

import swal from 'sweetalert';
import { Button, Form } from 'react-bootstrap';

function Home() {
    const navigate = useNavigate();
    const userId = getAuth().currentUser.uid
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPost, setSelectedPost] = useState({});
    const [openComment, setOpenComment] = useState(false);

    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
        const q = query(collection(db, "posts"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const t = [];
            querySnapshot.forEach((doc) => {
                t.push({ id: doc.id, openComments: false, ...doc.data() });
            });
            setPosts(t);

        });
    }

    const [userName, setUserName] = useState([]);
    const fetchUser = async () => {
        try {
            const docUser = await getDoc(doc(db, 'users', userId))
            setUserName(docUser.data().name);
        } catch (error) {
            console.log("Error.");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchPosts();
                await fetchUser();
            } catch (error) {
                swal('Error', 'Error, try again.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenComments = (index, changeTo) => {
        const updatedPosts = [...posts];
        updatedPosts[index].openComments = changeTo;
        setPosts(updatedPosts);
    };

    //Sign Out
    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log("Signout")
        }).catch((error) => {
            swal('Error', 'Error, try again.', 'warning');
        });
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="main-container">
            <div className="header">
                <div className="logo">
                    <h2>FinForo</h2>
                </div>
                <div className="search-container">
                    <Form.Control
                        style={{ width: '90%', fontFamily: 'QuicksandRegular', fontSize: '20px', backgroundColor: '#EEEEEE' }}
                        maxLength={30}
                        type='text'
                        placeholder='Search...'
                        onChange={(event) => setSearch(event.target.value)}
                        value={search}
                    />
                </div>
                <div className="user">
                    <h2>{userName}</h2>
                </div>
            </div>

            <div className="body">
                <div className="body-wrapper">
                    <div className="section">
                        <div className="nav">
                            <div onClick={() => { navigate('/'); }} className="nav-option nav-option-active">
                                <img src={require('../utils/img/home.png')} />
                                <h2>Home</h2>
                            </div>
                            <div onClick={() => { navigate('/simulation'); }} className="nav-option">
                                <img src={require('../utils/img/invest.png')} />
                                <h2>Simulation</h2>
                            </div>

                            <div onClick={() => { handleSignOut() }} className="nav-option">
                                <img src={require('../utils/img/logout.png')} />
                                <h2>Sign Out</h2>
                            </div>

                            <div className="nav-svg">
                                <SvgHome />
                            </div>
                        </div>

                        <div className="posts">
                            {posts.filter((post) =>
                                search === '' ||
                                post.title.toLowerCase().includes(search.toLowerCase())
                            ).length === 0 ? (
                                <div className="no-posts">
                                    <p>No posts found :(</p>
                                </div>
                            ) : (
                                posts.map((post, index) => (
                                    <button key={index}>
                                        <div className="info-post">
                                            <img src={require('../utils/img/user.png')} alt="User" />
                                            <h2>{post.user}</h2>
                                        </div>

                                        <hr className="comments-hr"/>

                                        <div className="description-post">
                                            <h3>{post.title}</h3>
                                            <p>{post.description}</p>
                                        </div>
                                        <div className="graph-post">
                                            <Chart data={post.simulation}/>
                                        </div>
                                        <hr className="comments-hr" />
                                        <div className="comments-post">
                                            <h2 onClick={() => { setOpenComment(true); setSelectedPost(post) }}>Comment</h2>
                                            <h3 onClick={() => { handleOpenComments(index, !post.openComments) }}>{post.comments.length} comments</h3>
                                        </div>
                                        {post.openComments && <ListComments comments={post.comments} />}
                                    </button>
                                ))
                            )}
                        </div>


                        <div className="options">
                            <h2>List of Companies</h2>
                            <div>
                                <img src={require('../utils/img/google.png')} />
                                <h2>Google</h2>
                            </div>

                            <div>
                                <img src={require('../utils/img/apple.png')} />
                                <h2>Apple</h2>
                            </div>

                            <div>
                                <img src={require('../utils/img/amazon.png')} />
                                <h2>Amazon</h2>
                            </div>

                            <div>
                                <img src={require('../utils/img/spotify.png')} />
                                <h2>Spotify</h2>
                            </div>

                            <div>
                                <img src={require('../utils/img/tesla.png')} />
                                <h2>Tesla</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {openComment && <Comment setOpenComment={setOpenComment} user={userName} selectedPost={selectedPost} />}
        </div>
    );
}

export default Home;