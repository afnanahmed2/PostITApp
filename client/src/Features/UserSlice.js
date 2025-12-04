
import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Logout
export const logout = createAsyncThunk("users/logout", async()=>{
  const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`)
  const msg  = response.data.msg
  console.log(msg)
})


//Login
export const login = createAsyncThunk(
  "users/login",
  async (userData,{rejectWithValue}) => {
    try {
      const {email,password} = userData;
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, {email,password});
      const user = response.data.user;
      const msg = response.data.msg;
      return { user, msg };
    } catch (error) {
      //const msg = 'Invalid credentials';
      const msg = error.response.data.msg;
      return rejectWithValue({ msg });
    }
  }
);

//register
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async(userData)=>{
    try{
      const {name,email,password} = userData
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/registerUser`,
        {name,email,password})
        const user = response.data.user
        const msg = response.data.msg
        return {user,msg}  //to keep this value in the store
    }
    catch(error){
      console.log(error)
      const msg = error.response.data.msg
      return {msg}
    }

  }
)
//const initialState = []

export const userSlice = createSlice({
  name: "users", //name of the state
  initialState:{user:null,
    msg:null,
    status:null,
    isLogin:false}, // initial value of the state
    reducers:{},
  extraReducers:(builder)=>{
    builder
    .addCase(registerUser.pending,(state)=>{state.status ="pending"})
    .addCase(registerUser.fulfilled,(state,action)=>{
      state.status="success"
      state.user=action.payload.user
      state.msg=action.payload.msg
    })
    .addCase(registerUser.rejected,(state,action)=>{
      state.status="rejected"
      state.msg=action.payload.msg
    })
//Login
    .addCase(login.pending,(state)=>{state.status ="pending"})
    .addCase(login.fulfilled,(state,action)=>{
      state.status="success"
      state.isLogin = true
      state.user=action.payload.user
      state.msg=action.payload.msg
    })
    .addCase(login.rejected,(state,action)=>{
      state.status="rejected"
      state.isLogin = false
      state.msg=action.payload.msg
    })

    //Logout
    .addCase(logout.pending, (state) => {
        state.status ="loading"
      })
      .addCase(logout.fulfilled, (state) => {
        // Clear user data or perform additional cleanup if needed
        state.isLogin = false;
        state.status = "success";
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.status="rejected"
      });

  },
});

//export const { } = userSlice.actions; //export the function

export default userSlice.reducer;
