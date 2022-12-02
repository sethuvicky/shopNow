import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Header from "../Home/Header";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../more/Loader";
import ProductCard from "./ProductCard";
import { clearErrors, getProduct } from "../../actions/ProductActions";
import Pagination from "react-js-pagination";
import "./Product.css";
import Typography from"@material-ui/core/Typography"
// import { useAlert } from "react-alert";
import MetaData from "../../more/Metadata";
import BottomTab from "../../more/BottomTab";
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { Link } from "react-router-dom";
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range)
const categories = [
    "cloth",
    "Food",
    "Gaming",
    "Electronics",
    "Sports",
]

const Products = ({ match }) => {
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 200000])

  const [categorys,setCategory] = useState("");

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
  } = useSelector((state) => state.products);

  const keyword = match.params.keyword;

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };


  useEffect(() => {
      if(error){
          alert(error);
          dispatch(clearErrors())
      }
    dispatch(getProduct(keyword, currentPage,price,categorys));
  }, [dispatch, keyword,currentPage,price,categorys,alert,error]); 
const clearfilter = (()=>{
  window.location.href='/products'
 })
console.log(categorys)

  return (
    <>
     
        <>
        <MetaData title="Products" />
          <Header />
          <div>
           {products.length === 0 ? 
            ""
            :
            <h2
            style={{
              textAlign: "center",
              width: "20vmax",
              fontSize: "1.4vmax",
              fontFamily: "Poppins,sans-serif",
              margin: "3vmax auto",
              color: "rgb(0, 0, 0, 0.7)",
            }}
          >
            Featured Products
          </h2>
           }
            <div className="sidebar__product" style={{
                display:"flex",
                flex:1,
            }}>
                <div style={{
                  margin:"1vmax",
                  flex:".177",
              }}>
                  <Typography style={{fontSize:"1.2vmax",padding:"5px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}> CATEGORIES <span style={{marginLeft:"10px",fontSize:"0.8rem",color:"#ED155D",textDecoration:"underline",cursor:"pointer"}} onClick={()=>dispatch(clearfilter())}>Clear</span></Typography>
                  <Typography style={{fontWeight:"700", fontSize:"1vmax",padding:"5px"}}>Price from Rs:{price[0]} To Rs:{price[1]}</Typography>
<div  style={{width:"90%",marginTop:"10%",marginBottom:"10%",background:"#F2F2F2" ,padding:"0.5rem"}}>


                  <Range
                                                marks={{
                                                    1: `$1`,
                                                    200000: `$1000`
                                                }}
                                                min={1}
                                                max={200000}
                                                defaultValue={[1, 200000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                dots
                                                pushable
                                                step={500}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />  
                                            </div>               
                  <ul className="categoryBox">
                      {categories.map((category) =>(
                          <li
                          style={{  color: category==categorys ? '#ED155D' : 'black'
                        }}
                          className="category-link"
                          key={category}
                          onClick={() =>setCategory(category)}
                          type="checkbox">
                          {category}
                          </li> 
                      ))}
                  </ul>
                  <Typography style={{fontSize:"1.2vmax",padding:"5px"}}>QUICK LINKS</Typography>
                  <li className="category-link">
                   <Link to='/cart'> My Carts </Link>  
                  </li>
                  <li className="category-link">
                  <Link to='/favourites'>Favourites Items </Link>  

                  </li>
                  
              </div>

             {products.length === 0 ?
             <span style={{
               display:"block",
               padding:"30px 0",
               fontSize:"1.5rem",
               flex:".9",
               textAlign:"center"
             }}>No Product Found ....</span>
             : 
             <div
             className="products"
             style={{
               display: "flex",
               flexWrap: "wrap",
               justifyContent: "center",
               flex:".9"
             }}
           >
             {products &&
               products.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
           </div>
              }
             
             </div>
            
              <div
                className="pagination__box"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "6vmax",
                }}
              >
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="First"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
          </div>
          <Footer />
          <BottomTab />
        </>
 
    </>
  );
};

export default Products;
