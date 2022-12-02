import React, { useEffect ,useState} from "react";
import "./Home.css";
import Carousel from "react-material-ui-carousel";
import bg from "../../images/banner1.jpg";
import bg2 from "../../images/banner2.jpg";
import ProductCard from "../Products/ProductCard";
import  {useDispatch, useSelector} from "react-redux"
import { clearErrors, getProduct } from "../../actions/ProductActions";
import Header from "./Header";
import MetaData from "../../more/Metadata";
import axios from "axios";
import Footer from "../../Footer";
import BottomTab from "../../more/BottomTab";
import Loading from "../../more/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed:3000,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000
  };
  let [product ,setproduct] = useState()
  let [electCats ,setelectCats] = useState()
  let [clothCats ,setclothCats] = useState()
  let [gamingCats ,setgamingCats] = useState()


  const dispatch = useDispatch();
  const { products,error,loading } = useSelector(
    (state) => state.products
  );
  const Electronics = []
  const Cloths = []
  const Gaming = []



let getProducts = (async()=>{
  let data = await axios.get('/api/v2/products/all')
  setproduct(data.data.products)

})
console.log(product)
useEffect(()=>{
  getProducts()

},[])
   useEffect(() => {
    setelectCats(Electronics)
    setclothCats(Cloths)
    setgamingCats(Gaming)
    product && product.forEach((item)=>{
      if(item.category === 'Electronics'){
        Electronics.push(item)
       }
    })
    product && product.forEach((item)=>{
      if(item.category === 'cloth'){
        Cloths.push(item)
       }
    })
    product && product.forEach((item)=>{
      if(item.category === 'Gaming'){
        Gaming.push(item)
       }
    })
    }, [product])

  console.log(electCats)
    return (
    <>
    {loading ? (
      <Loading />
    )
    : (
      <>
      <MetaData title="Home" />
      <Header />
        {/* Carousel */}
        <div className="banner">
               <Carousel>
                 <img src={bg} className="bgImg"/>
                 <img src={bg2} className="bgImg"/>
               </Carousel>
             <div className="home__content">
               <div style={{
                 display:"flex",
                 alignItems:"center",
               }}>
          
       
               </div>
               <div>
                 <h2 style={{
                   fontSize:"4.5em",
                   fontFamily:"Poppins,sans-serif",
                   color:"#ED155D",
                 }}>Fashionable</h2>
               </div>
               <div>
                 <h2 style={{
                   fontSize:"4.5em",
                   fontWeight:"400",
                   fontFamily:"Poppins,sans-serif",
                   color:"black",
                   lineHeight:".7"
                 }}>Collection</h2>
               </div>
               <div>
                 <h2
                 style={{
                   fontWeight:"400",
                   fontFamily:"Poppins,sans-serif",
                   color:"black",
                   fontSize:"1em",
                   paddingTop:"10px"
                 }}
                 >
                 Get 50% discounts all Products 
                 </h2>
               </div>
               <div>
               <Link to="/search">
                  <div  style={{
                   width:"135px",
                   height:"50px",
                   border:"none",
                   background:"#ED155D",
                   margin:"10px 0",
                   fontSize:"1.2vmax",
                   color:"#fff",
                   cursor:"pointer",
                   display:"flex",
                   alignItems:"center",
                   justifyContent:"center"

                 }}
                 >Search   
       
       </div>   </Link>
                  <div>
      
        </div>
               </div>
             </div>
         </div>
         <h2 className="homeHeading">Electronics Products</h2>

         <Slider {...settings}>
     
      {electCats && electCats.length>4 && electCats.map((item)=>(
          <ProductCard key={item._id} product={item} />
          ))}
        </Slider>
        <h2 className="homeHeading">Clothing accessories</h2>

<Slider {...settings}>

{clothCats && clothCats.length>4 &&  clothCats.map((item)=>(
 <ProductCard key={item._id} product={item} />
 ))}
</Slider>
<h2 className="homeHeading">Gaming accessories</h2>

<Slider {...settings}>

{gamingCats &&  gamingCats.length>4 && gamingCats.map((item)=>(
 <ProductCard key={item._id} product={item} />
 ))}
</Slider>

      <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
      <Footer />
      <BottomTab />
      </>    
    )}
    </>
  );
};

export default Home;
