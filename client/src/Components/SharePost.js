import {Button, Col, Container, Row,Input,} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { savePost } from "../Features/PostSlice"


const SharePosts = () => {
    const {user} = useSelector((state) => state.users) 
    const [postMsg, setPost] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const postHandler =()=>{
      if(!postMsg){
        alert('Please enter your message')
        return
      }
      const email = user.email
      const postData = {postMsg, email}
      dispatch(savePost(postData))
      setPost("")
    
    }

    return (
    <Container>
      <Row>
        <Col>
          <Input
            id="share"
            name="share"
            placeholder="Share your thoughts..."
            type="textarea"
            value={postMsg}
            onChange={e => setPost(e.target.value)}
          />
          <Button onClick={postHandler}>PostIT</Button>
        </Col>
      </Row>
    </Container>
  );
  
    }

export default SharePosts;
