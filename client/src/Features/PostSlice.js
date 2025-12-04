import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
//import { act } from "react";
//import { act } from "react";
export const likePost = createAsyncThunk(
  "posts/likePost",
  async(postData)=>{
    try{
      //for update the data put req
      const {postId,userId} = postData
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/likePost`,{postId,userId});
      const post = response.data.post
      return post
    }
    catch(error){
      console.log(error)
    }
  }
)

export const getPosts = createAsyncThunk(
  "posts/getPosts", async()=>{
    try{
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getPosts`)
      const posts = response.data.posts
      const count = response.data.count
      return {posts,count}
    }
    catch(error){
      console.log(error)
    }
  }
)


//SavePost
export const savePost = createAsyncThunk(
  "posts/savePost",
  async(postData)=>{
    try{
      const {postMsg,email} = postData
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/savePost`,
        {postMsg,email})
        const post = response.data.post
        const msg = response.data.msg
        return {post,msg}  //to keep this value in the store
    }
    catch(error){
      console.log(error)
      const msg = error.response.data.msg
      return {msg}
    }

  }
)
//const initialState = []

export const PostSlice = createSlice({
  name: "posts", //name of the state
  initialState:{
    status: "idle",
    posts: [],
    comments: [], // initial value of the state
    likes: [],
},
    reducers:{},
  extraReducers:(builder)=>{
    builder
    //savePost
    .addCase(savePost.pending,(state)=>{
      state.status ="pending"
    })
    .addCase(savePost.fulfilled,(state,action)=>{
      state.status="success"
      state.posts.unshift(action.payload.post)
      })
    .addCase(savePost.rejected,(state,action)=>{
      state.status="rejected"
      state.msg= action.payload.msg
    })
//getPosts
    .addCase(getPosts.pending,(state)=>{
      state.status ="pending"
    })
    .addCase(getPosts.fulfilled,(state,action)=>{
      state.status="success"
      state.posts = action.payload.posts 
      })
    .addCase(getPosts.rejected,(state)=>{
      state.status="rejected"
    })
//likePost
    .addCase(likePost.pending,(state)=>{
      state.status ="pending"
    })
    .addCase(likePost.fulfilled,(state,action)=>{
      state.status="success"
      const updateIndex = state.posts.findIndex(post => post._id === action.payload._id) 
      state.posts[updateIndex].likes = action.payload.likes;
      })
      
    .addCase(likePost.rejected,(state)=>{
      state.status="rejected"
    })


  },
});

//export const { } = userSlice.actions; //export the function

export default PostSlice.reducer;
