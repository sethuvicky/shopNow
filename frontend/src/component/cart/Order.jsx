import React, {useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import './Cashon.css'
import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { createOrder, clearErrors } from "../../actions/OrderAction";
import { removeItemsFromCart } from "../../actions/CartAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../more/Loader";
const Payment = ({ history }) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();

  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error,loading } = useSelector((state) => state.order);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };
  const cancelOrder = async (e) => {
    e.preventDefault();
    history.push("/")

  }
  const orderConfrim = async (e) => {
    e.preventDefault();
    dispatch(removeItemsFromCart())

    try {
    
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post("/api/v2/order/new", order, config);
        console.log(data)
        if(data.success === true){
            localStorage.removeItem('cartItems')
          let carts =  localStorage.removeItem('cartItems')

          if(!carts){
            toast.success('Products ordered')

            window.location.href='/'

          }

        }else{
            history.push("/")

        }
    
      } catch (error) {
        console.log(error)
    
      }

    
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, toast]);

  return (    <>
<div className="container">
    <div>
        <h1>Confrim Order</h1>
        <img width={250} alt='tick' src={`https://thumbs.dreamstime.com/b/check-mark-valid-seal-icon-white-squared-tick-pink-circle-flat-ok-sticker-isolated-accept-button-good-web-software-149502631.jpg`} />
        <div className="card">

    <button className="buttonConfrim" onClick={(e)=>{orderConfrim(e)}}>Confrim</button>
    <button className="buttonCancel" onClick={(e)=>{cancelOrder(e)}}>Cancel</button>
    </div>



    </div>

</div>

 
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
  </>
  );
};

export default Payment;