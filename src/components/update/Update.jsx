import "./update.scss";
import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {

   
    const [ cover, setCover] = useState(null);
    const [ profile, setProfile] = useState(null);
    const [ texts, setTexts ]= useState({
        name: "",
        city: "",
        website: ""
    });

    const handleChange = (e) => {
        setTexts((prev) => ({...prev, [e.target.name]: [e.target.value] }));
    }

    const upload = async (file) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await makeRequest.post("/upload", formData);
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };

      const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user)=>{
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["user"])
    },
  })

  const {currentUser} = useContext(AuthContext)

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl = user.coverPic;
    let profileUrl = user.profilePic;

    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    // if (file) {
    //   const filename = await upload();
    //   imgUrl = `http://localhost:8800/upload/${filename}`;
    // }
    mutation.mutate({...texts, coverPic: coverUrl, profilePic: profileUrl});
    setOpenUpdate(false);
  };


    return(
        <div className="update">Update
            <form>
                <input type="file" onChange={e=>setCover(e.target.files[0])}/>
                <input type="file" onChange={e=>setProfile(e.target.files[0])}/>
                <input type="text" name="name" onChange={handleChange}/>
                <input type="text" name="city" onChange={handleChange}/>
                <input type="text" name="website" onChange={handleChange}/>
                <button onClick={handleClick}>Update</button>
            </form>
            <button onClick={()=>setOpenUpdate(false)}>X</button>
        </div>
    )
};

export default Update;