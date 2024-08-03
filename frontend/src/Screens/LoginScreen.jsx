import { useState,useEffect } from "react";
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {Form,Button,Row,Col} from 'react-bootstrap';
import {useDispatch,useSelector} from 'react-redux';
import FormContainer from "../components/FormContainer";
import Loader from '../components/Loader';
import {useLoginMutation} from '../slices/userApiSlice';
import {setCredentials} from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen =()=>{
    const [email,setEmail]=useState(''); 
    const [password,setPassword]=useState('');
    const [errors, setErrors] = useState({});
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login,{isLoading}] = useLoginMutation();
    const {userInfo} = useSelector((state)=>state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    },[userInfo,redirect,navigate]); 

    const validate = () => {
        const errors = {};
        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid";
        }
        if (!password) {
            errors.password = "Password is required";
        } 
        return errors;
    };
    const submitHandler = async(e)=>{
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try{
            const res= await login({email,password}).unwrap();
            dispatch(setCredentials({...res,}));
            navigate(redirect);
        }catch(err){  
            toast.error(err?.data?.message || err.error);
        }
        console.log('submit');
    }

    return(
        <FormContainer>
            <h1>Sign In</h1> 
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        isInvalid={!!errors.email}
                    ></Form.Control> 
                                        {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}   
                </Form.Group>  
                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}  
                        onChange={(e)=>{setPassword(e.target.value)}}
                        isInvalid={!!errors.password}
                    ></Form.Control>
                      {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}    
                </Form.Group>  
                <Button type="submit" variant="primary" className="mt-3" disabled={isLoading}>Sign In</Button>
                {isLoading && <Loader/>}
            </Form>
            <Row className="py-3">
                <Col>
                New Customer?<Link to={redirect ? `/register?redirect=${redirect}` : '/register'}> Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
}
export default LoginScreen;  
