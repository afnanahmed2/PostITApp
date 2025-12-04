import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import bcrypt from "bcrypt";
import PostModel from "./Models/PostModele.js";
import dotenv from 'dotenv'

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

//Database connection
const connectString =`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postitcluster.bhf0vvs.mongodb.net/${process.env.DB_NAME}?appName=PostITCluster`;
mongoose.connect(connectString);
//express post method to Post users data Msg info Thoughts
app.post("/savePost",async(req,res)=>{
    try{
        const{postMsg,email} = req.body
        const post = new PostModel({postMsg,email})
        await post.save()
        res.send({
          post:post,
          msg:"Post is added successfully.."})
    }

    catch(error){
        console.log(error)
        res.status(500).send({msg:"An Error occurred"})
    }
})


//express post method to register user data info userInfos collection
app.post("/registerUser",async(req,res)=>{
    try{
        const{name,email,password} = req.body
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new UserModel({name,email,password:hashedpassword})
        console.log(user)
        await user.save()
        res.send({user:user,msg:"documents saved successfully"})
    }

    catch(error){
        console.log(error)
        res.status(500).send({msg:"An Error occurred"})
    }
})
//expres method to handle http post request and authintication user logout
app.post("/logout", async(req,res) =>{ 
  res.status(200).send({msg: "logout successful"});
})

//expres method to handle http post request and authintication user login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    // User not found
    if (!user) {
      res.status(401).send({ msg: "Invalid email!" }); 
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      //password mismatch
      if (!passwordMatch) {
        res.status(401).send({ msg: "Incorrect password!" });
      } else {
        res.status(200).send({ user: user, msg: "Authentication is successfull" });
      }
    }
  } catch (error) {
    // Unexpected server errors!
    res.status(500).send({ msg: "An unexpected error occurred" });
  }
});

//express method to handle http get req to get all posts
app.get("/getPosts",async(req,res)=>{
  try{
    const posts = await PostModel.find().sort({createdAt: -1 });
    const count = await PostModel.countDocuments()
    res.send({posts:posts,count:count})
  }
   catch (error) {
    // Unexpected server errors!
    res.status(500).send({ msg: "An unexpected error occurred" });
  }
})

////Like
app.put("/likePost",async(req,res)=>{
  try{
    const{postId,userId} = req.body;
    const postToUpdate = await PostModel.findOne({_id:postId})
    if(!postToUpdate)
      return res.send(404).send({msg:"Post is not found"})

    const userIndex = postToUpdate.likes.user.indexOf(userId)
    if(userIndex === -1){
      //User not yet liked the post. increase the countand insert userId into users array
      const updatedPost = await PostModel.findOneAndUpdate(
      {_id:postId},
      {
        $inc : {"likes.count": 1},
        $addToSet : {"likes.user": userId}
      },
      {new: true}
      )
      res.status(200).send({post:updatedPost,msg:"Post not yet Liked"})
    }

    else{
      ///User liked the post already
      const updatedPost = await PostModel.findOneAndUpdate(
      {_id:postId},
      {
        $inc : {"likes.count": -1},
        $pull : {"likes.user": userId}
      },
      {new: true}
      )
      res.status(200).send({post:updatedPost,msg:"Post is Liked"})
    }

    }
  
  catch (error) {
      console.error(error);
      res.status(500).send({ msg: "An error occurred" });
    }

})

app.listen(process.env.PORT,()=>{
    console.log("server connected successfully")
});


