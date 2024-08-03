import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
//@desc   Auth user & get token
//@routes POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && (await user.matchPassword(password))) {
    console.log('password matched');
    generateToken(res,user._id);  
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "30d",
    // });    

    // //Set jwt as HTTP-Only cookie
    // res.cookie("jwt", token, {
    //   httponly: true,
    //   secure: process.env.NODE_ENV !== "development",
    //   samesite: "strict",
    //   maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    // });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

  } else {
        console.log("NOT Matched")
        res.status(401);
        throw new Error("Invalid email or password");
  }
});

//@desc   Register user
//@routes POST /api/users/
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
    console.log('register');
    const {name,email,password} = req.body;
    const userExist = await User.findOne({email});

    if(userExist){
      res.status(400);
      throw new Error('User with this email already exists!');  
    }
    const user = await User.create({name,email,password});

    if(user){
      generateToken(res,user._id);
      console.log(user.name);  
      res.status(200).json({
        _id:user._id, 
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin     
      });
    }else{  
      res.status(400);
      throw new Error('Invalid user data');  
    }
});

//@desc   Logout user / clear cookie
//@routes POST /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0)
  });  
  res.status(200).json({message:"Logged out successfully"});  
});     

//@desc  Get User Profile
//@routes POST /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if(user){    
      res.status(200).json({
        _id:user._id, 
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin     
      });
    }else{  
      res.status(400);
      throw new Error('No user found');  
    }
});

//@desc  Get User Profile
//@routes POST /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  console.log(req.user._id);
  const user = await User.findById(req.user._id);
  console.log(user);
  if(user){
    user.name  = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password){
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    console.log(updatedUser);

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });  

  }else{
    res.status(400);
    throw new Error('User not found');
  }
});

//@desc  Get User
//@routes GET /api/users/
//@access private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});  

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
