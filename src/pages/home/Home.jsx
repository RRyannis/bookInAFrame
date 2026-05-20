import './home.scss';
import Posts from '../../components/posts/Posts';
import Share from '../../components/share/Share';
import { useState } from 'react';

const Home = () => {
    const [feedType, setFeedType] = useState("all");

    return(
        <div className='home'>
            <Share />
            <div className="feedTabs">
                <button 
                    className={feedType === "all" ? "active" : ""} 
                    onClick={() => setFeedType("all")}
                >
                    All
                </button>
                <button 
                    className={feedType === "following" ? "active" : ""} 
                    onClick={() => setFeedType("following")}
                >
                    Following
                </button>
            </div>
            <Posts feedType={feedType} />
        </div>
    );
};

export default Home;