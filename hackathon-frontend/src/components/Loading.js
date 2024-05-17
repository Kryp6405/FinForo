import './Loading.css';

function Loading() {
    return (
        <div className="loading">
            <center>
                <hr className='invisibleLoading'/>
                <hr className='invisibleLoading'/>
                <hr className='invisibleLoading'/>
                <hr className='invisibleLoading'/>
                <hr className='invisibleLoading'/>
                <hr className='invisibleLoading'/>
                <hr className='invisibleLoading'/>
                <h1>Loading</h1>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </center>
        </div>
    );
}

export default Loading;
