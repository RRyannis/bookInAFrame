import Post from "../post/Post";
import './posts.scss';
import mockingbird from "../../assets/bookFrame2.jpg";
import iceShard from "../../assets/bookFrame1.jpg";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {

  // const posts = [
  //   { id:1, name: "John Dove", userId: 1, profilePic: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600", desc: "Lovely quote from To Kill a Mockingbird", img: mockingbird }, { id:2, name: "Susan Johnson's Baby Shampoo", userId: 2, profilePic: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg", desc: "Intriguing quote from Sword of Destiny", img: iceShard }
  // ];

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await makeRequest.get("/posts?userId=", userId);
       
      return res.data;
    }
  });
  console.log(data);

  return <div className="posts">
    {error ? "Something went wrong" :
    (isLoading ? "is loading" : data?.map((post)=>(
      <Post post={post} key={post.id}/>)
    ))}
  </div>;
};

export default Posts;