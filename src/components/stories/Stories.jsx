import './stories.scss';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext"

const Stories = () => {

    const {currentUser} = useContext(AuthContext)

    //temp data
    const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 2,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 4,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
  ];

    return(
        <div className='stories'>
            <div className="story">
    <img
        // FIX: Add optional chaining and a fallback image URL
        src={currentUser?.avatar_url || 'default_placeholder_image_url'} 
        alt=""
    />
    <span>
        {/* FIX: Add optional chaining for safe property access */}
        {currentUser?.full_name || currentUser?.username}
    </span>
</div>
            {stories.map(story=>(
                <div className="story" key={story.id}>
                <img src={story.img} alt="" />
                <span>{story.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Stories;